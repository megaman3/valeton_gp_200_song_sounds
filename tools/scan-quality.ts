/**
 * Kvalitetsskanning av låtdatan – regelbaserad, utan webb och utan AI.
 * Hittar låtar där underlaget är svagt eller motsägelsefullt, så att research kan prioriteras.
 *
 *   npm run scan-quality              # rapport till tools/quality-report.md + .csv, topp 30 i terminalen
 *   npm run scan-quality -- --top 50  # visa fler i terminalen och rapporten
 */
import { writeFileSync } from 'node:fs';
import { database, translator } from '../src/engine';
import { songKey } from '../src/engine/ToneTranslator';
import { riskLevel, scanTone, type ToneScan } from '../src/engine/QualityScan';

const topArg = process.argv.indexOf('--top');
const TOP = topArg > 0 ? Number(process.argv[topArg + 1]) || 30 : 30;

interface SongScan {
  artist: string;
  song: string;
  sources: Set<string>;
  score: number;
  parts: ToneScan[];
}

// Handskrivna låtar har företräde i appen – deras importerade toner visas inte och skannas inte.
const curatedKeys = new Set(database.curatedSongs.map((s) => songKey(s.artist, s.title)));

const songs = new Map<string, SongScan>();
for (const [dataset, source] of [
  [database.external, 'GuitarToneAdapt'],
  [database.research, 'egen research'],
] as const) {
  for (const tone of dataset.tones) {
    const key = songKey(tone.artist, tone.song);
    if (curatedKeys.has(key)) continue;
    const scan = scanTone(tone, translator.toPart(tone));
    // Samma låt från båda källorna är en låt i appen (researchdelarna läggs till) – räkna den en gång.
    const entry = songs.get(key) ?? { artist: tone.artist, song: tone.song, sources: new Set<string>(), score: 0, parts: [] };
    entry.sources.add(source);
    entry.parts.push(scan);
    entry.score = Math.max(entry.score, scan.score);
    songs.set(key, entry);
  }
}

const ranked = [...songs.values()].sort((a, b) => b.score - a.score || a.artist.localeCompare(b.artist));
const levels = { hög: 0, medel: 0, låg: 0 };
for (const s of ranked) levels[riskLevel(s.score)]++;

const reasonsOf = (s: SongScan) => {
  const worst = s.parts.reduce((a, b) => (b.score > a.score ? b : a));
  return worst.findings.sort((a, b) => b.points - a.points).map((f) => f.reason);
};

// Per artist: hur många låtar med hög/medel risk – där ger research per artist mest.
const artists = new Map<string, { songs: number; high: number; medium: number; total: number }>();
for (const s of ranked) {
  const a = artists.get(s.artist) ?? { songs: 0, high: 0, medium: 0, total: 0 };
  a.songs++;
  a.total += s.score;
  if (riskLevel(s.score) === 'hög') a.high++;
  else if (riskLevel(s.score) === 'medel') a.medium++;
  artists.set(s.artist, a);
}
const artistRanked = [...artists.entries()]
  .filter(([, a]) => a.high + a.medium > 0)
  .sort((a, b) => b[1].high * 3 + b[1].medium - (a[1].high * 3 + a[1].medium) || b[1].total - a[1].total);

/** Regler som tyder på faktiska fel (inte bara svagt underlag) – billigast att kontrollera, störst nytta. */
const CONTRADICTIONS = new Set(['bass-amp-model', 'bass-gear', 'rickenbacker', 'era', 'genre-gain', 'clean-highgain', 'type-gain']);
const contradictions = ranked.flatMap((s) =>
  s.parts.flatMap((p) =>
    p.findings.filter((f) => CONTRADICTIONS.has(f.rule)).map((f) => ({ s, p, f })),
  ),
).sort((a, b) => b.f.points - a.f.points || a.s.artist.localeCompare(b.s.artist));

// Regelstatistik
const ruleCount = new Map<string, number>();
for (const s of ranked) for (const p of s.parts) for (const f of p.findings) ruleCount.set(f.rule, (ruleCount.get(f.rule) ?? 0) + 1);

const esc = (t: string) => t.replace(/\|/g, '\\|');
const md: string[] = [
  '# Kvalitetsskanning av låtdatan',
  '',
  `Genererad ${new Date().toISOString().slice(0, 10)} av \`npm run scan-quality\` – regelbaserad, utan webb och utan AI.`,
  'Poängen visar hur svagt eller motsägelsefullt underlaget är (högre = mer misstänkt), inte hur bra presetet låter.',
  '',
  `**${ranked.length} låtar skannade** (handskrivna låtar ingår inte): ` +
    `**${levels.hög} hög risk** (6+), **${levels.medel} medel** (3–5), **${levels.låg} låg** (0–2).`,
  '',
  '## Regler som slog till',
  '',
  '| Regel | Delar |',
  '|---|---|',
  ...[...ruleCount.entries()].sort((a, b) => b[1] - a[1]).map(([r, n]) => `| ${r} | ${n} |`),
  '',
  `## Motsägelser (${contradictions.length}) – troliga fel att rätta först`,
  '',
  'Regler som tyder på faktiska fel: basutrustning, fel epok, ren del på high gain-modell, gain som inte passar.',
  '',
  '| Regel | Artist – Låt | Del | AMP | Skäl |',
  '|---|---|---|---|---|',
  ...contradictions.map(
    ({ s, p, f }) =>
      `| ${f.rule} | ${esc(s.artist)} – ${esc(s.song)} | ${p.tone.part}/${p.tone.toneType} | ${p.ampModel ?? ''} | ${esc(f.reason)} |`,
  ),
  '',
  `## Topp ${TOP} mest misstänkta låtar (svagast underlag)`,
  '',
  '| # | Poäng | Artist – Låt | Källa | AMP | Skäl |',
  '|---|---|---|---|---|---|',
  ...ranked.slice(0, TOP).map((s, i) => {
    const amp = [...new Set(s.parts.map((p) => p.ampModel))].join(', ');
    return `| ${i + 1} | ${s.score} | ${esc(s.artist)} – ${esc(s.song)} | ${[...s.sources].join(' + ')} | ${amp} | ${esc(reasonsOf(s).join('; '))} |`;
  }),
  '',
  '## Artister att researcha först',
  '',
  'Sorterat på antal låtar med hög risk (vägt ×3) plus medel risk.',
  '',
  '| Artist | Låtar | Hög | Medel | Snittpoäng |',
  '|---|---|---|---|---|',
  ...artistRanked.slice(0, TOP).map(
    ([name, a]) => `| ${esc(name)} | ${a.songs} | ${a.high} | ${a.medium} | ${(a.total / a.songs).toFixed(1)} |`,
  ),
  '',
];
writeFileSync('tools/quality-report.md', md.join('\n'));

const csvCell = (t: string | number) => `"${String(t).replace(/"/g, '""')}"`;
const csv = [
  ['poäng', 'risk', 'artist', 'låt', 'källa', 'amp', 'skäl'].join(','),
  ...ranked.map((s) =>
    [s.score, riskLevel(s.score), s.artist, s.song, [...s.sources].join(' + '), [...new Set(s.parts.map((p) => p.ampModel))].join(' / '), reasonsOf(s).join('; ')]
      .map(csvCell)
      .join(','),
  ),
];
writeFileSync('tools/quality-report.csv', csv.join('\n') + '\n');

console.log(`${ranked.length} låtar: ${levels.hög} hög risk, ${levels.medel} medel, ${levels.låg} låg. ${contradictions.length} motsägelser.\n`);
for (const [i, s] of ranked.slice(0, TOP).entries()) {
  console.log(`${String(i + 1).padStart(3)}. [${s.score}] ${s.artist} – ${s.song} (${[...s.sources].join(' + ')})`);
  for (const r of reasonsOf(s)) console.log(`       - ${r}`);
}
console.log('\nRapport: tools/quality-report.md och tools/quality-report.csv');
