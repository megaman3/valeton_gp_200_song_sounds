/**
 * Importerar GuitarToneAdapt Guitar Tone Dataset (CC BY 4.0) och normaliserar det
 * till src/data/external/guitartoneadapt.json. Ingen AI – bara nedladdning + normalisering.
 *
 *   npm run import:gta                 # hämtar senaste versionen från GitHub
 *   npm run import:gta -- ./fil.json   # använder en lokal kopia
 *
 * Översättningen till GP-200-modeller sker i src/engine/ToneTranslator.ts, så att
 * regeländringar inte kräver ny import.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import type { ResearchedTone } from '../src/types';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pera-Labs/guitar-tone-dataset/master/guitar-tones.json';
const OUT = 'src/data/external/guitartoneadapt.json';

interface RawRecord {
  song?: unknown;
  artist?: unknown;
  genre?: unknown;
  era?: unknown;
  tone_type?: unknown;
  part?: unknown;
  amp_settings?: Record<string, unknown>;
  original_gear?: { amp?: unknown; guitar?: unknown; notes?: unknown };
  effects?: unknown;
  pickup?: unknown;
  confidence?: unknown;
  sources?: unknown;
  url?: unknown;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const CONFIDENCE_WORDS: Record<string, number> = { low: 0.4, medium: 0.6, high: 0.85 };

export function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalize(r: RawRecord): ResearchedTone | { skip: string } {
  const song = str(r.song);
  const artist = str(r.artist);
  if (!song || !artist) return { skip: 'saknar låt/artist' };
  const toneType = str(r.tone_type).toLowerCase();
  if (toneType === 'bass') return { skip: 'basljud' };

  const a = r.amp_settings ?? {};
  const conf =
    num(r.confidence) ?? CONFIDENCE_WORDS[str(r.confidence).toLowerCase()] ?? 0.5;

  return {
    id: slug(`${artist}-${song}-${str(r.part) || 'main'}-${toneType}`),
    artist,
    song,
    genre: str(r.genre).toLowerCase(),
    era: str(r.era),
    toneType,
    part: str(r.part).toLowerCase() || 'main',
    ampSettings: {
      gain: num(a.gain) ?? 5,
      bass: num(a.bass) ?? 5,
      mid: num(a.mid) ?? 5,
      treble: num(a.treble) ?? 5,
      presence: num(a.presence) ?? 5,
      reverb: num(a.reverb) ?? 0,
    },
    amp: str(r.original_gear?.amp),
    guitar: str(r.original_gear?.guitar),
    notes: str(r.original_gear?.notes),
    effects: Array.isArray(r.effects) ? r.effects.map(str).filter(Boolean) : [],
    pickup: str(r.pickup),
    confidence: Math.max(0, Math.min(1, conf)),
    sources: Array.isArray(r.sources) ? r.sources.map(str).filter((s) => /^https?:\/\//.test(s)) : [],
    url: str(r.url),
  };
}

async function main() {
  const localFile = process.argv[2];
  const text = localFile
    ? readFileSync(localFile, 'utf8')
    : await fetch(SOURCE_URL).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} från ${SOURCE_URL}`);
        return res.text();
      });
  const raw = JSON.parse(text) as unknown;
  if (!Array.isArray(raw)) throw new Error('Oväntat format: förväntade en JSON-array.');

  const tones: ResearchedTone[] = [];
  const skipped: Record<string, number> = {};
  const seen = new Set<string>();
  for (const r of raw as RawRecord[]) {
    const n = normalize(r);
    if ('skip' in n) {
      skipped[n.skip] = (skipped[n.skip] ?? 0) + 1;
      continue;
    }
    let id = n.id;
    for (let i = 2; seen.has(id); i++) id = `${n.id}-${i}`;
    seen.add(id);
    tones.push({ ...n, id });
  }

  const out = {
    source: 'GuitarToneAdapt – Guitar Tone Dataset',
    sourceUrl: localFile ? `lokal fil: ${localFile}` : SOURCE_URL,
    homepage: 'https://guitartoneadapt.com',
    license: 'CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)',
    attribution:
      'Data från GuitarToneAdapt (https://guitartoneadapt.com), CC BY 4.0. Normaliserad och översatt till Valeton GP-200-modeller av detta projekt.',
    importedAt: new Date().toISOString(),
    count: tones.length,
    tones,
  };
  writeFileSync(OUT, JSON.stringify(out) + '\n');
  console.log(`Skrev ${tones.length} ljud till ${OUT}. Hoppade över:`, skipped);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
