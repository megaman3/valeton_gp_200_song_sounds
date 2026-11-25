import type { ResearchedTone, SongPart } from '../types';

/**
 * Regelbaserad kvalitetsskanning av låtdata – ingen AI, ingen webb.
 *
 * Bedömer inte om ett preset *låter* bra, utan hur svagt eller motsägelsefullt underlaget är,
 * så att webbresearch kan läggas där den sannolikt ändrar något. Högre poäng = mer misstänkt.
 */
export interface QualityFinding {
  rule: string;
  points: number;
  reason: string;
}

export interface ToneScan {
  tone: ResearchedTone;
  ampModel?: string;
  score: number;
  findings: QualityFinding[];
}

/** GP-200-förstärkare som bygger på basförstärkare. */
const BASS_AMPS = new Set(['Classic Bass', 'Foxy Bass', 'Mess Bass', 'Mini Bass', 'Bass Pre']);

/** Modern high gain (Rectifier, 5150, Diezel, ENGL m.fl.) – fanns inte före ca 1980. */
const MODERN_HIGH_GAIN = /^(Mess|EV 51|Dizz|Eagle|Power LD|Bog Red|Flagman|Solo100 (OD|LD)|Juice R100)/;

/**
 * Förstärkarmodeller som är tydligt distade – udda val för en ren del. Marshall UK 800/900 räknas inte:
 * JCM800 har bara en kanal och originalet blir rent genom att gain/gitarrvolym dras ner.
 */
const HIGH_GAIN = /^(Mess|EV 51|Dizz|Eagle|Power LD|Bog Red|Flagman|Solo100 (OD|LD)|Juice R100|Bad-KT OD)/;

/**
 * Basgitarr i gitarrfältet. "Bass" ensamt räcker inte: "Marshall Super Bass" är en gitarrförstärkare,
 * "Bass 3" ett rattläge och "bass pickup" en mikrofon.
 */
const BASS_GUITAR = /violin bass|precision bass|jazz bass|\bp-bass\b|bass guitar|\bbass \+|\(bass\)|^bass\b/i;
/** Uttalade basförstärkare/-kabinett i förstärkarfältet. */
const BASS_AMP_TEXT = /\bsvt\b|gallien.?krueger|\bbass amp\b|\bbass cab|8x10|b-15|portaflex/i;

const METAL_GENRE = /metal|metalcore|thrash|djent|deathcore|doom/i;
const SOFT_GENRE = /jazz|country|reggae|soul|folk|bossa|swing/i;

/** Osäkerhet om utrustningen (inte om rattlägen, som alltid är uppskattningar). */
const HEDGES =
  /\b(likely|possibly|probably|debated|unconfirmed|not confirmed|uncertain|unclear|speculat\w*|rumou?red|inte bekräftad|ej bekräftad|inte belagd|ej belagd|inte dokumenterad|ej verifierat|källorna går isär)\b/gi;
const GENERIC = /genretypisk|ingen dokumenterad gitarrutrustning/i;

/** Källor som bara är forum/video – svagare än intervjuer och rig rundowns. */
const WEAK_SOURCE = /reddit\.com|forum|ultimate-guitar|youtube\.com|youtu\.be|tiktok|quora/i;

/** Första årtalet i epokfältet ("1970s", "1979", "1980s (early 1980s)") → årtiondet, annars undefined. */
export function decade(era: string): number | undefined {
  const m = era.match(/(1[89]\d|20[0-2])\d/);
  return m ? Number(m[1]) * 10 : undefined;
}

export function scanTone(tone: ResearchedTone, part: SongPart): ToneScan {
  const findings: QualityFinding[] = [];
  const add = (rule: string, points: number, reason: string) => findings.push({ rule, points, reason });
  const ampModel = part.overrides?.AMP?.model;
  const notes = part.translationNotes ?? [];
  const gain = tone.ampSettings.gain;

  // 1. Källans egen säkerhet
  if (tone.confidence < 0.4) add('confidence', 3, `låg säkerhet i källan (${tone.confidence})`);
  else if (tone.confidence < 0.5) add('confidence', 2, `ganska låg säkerhet i källan (${tone.confidence})`);
  else if (tone.confidence < 0.6) add('confidence', 1, `medelhög säkerhet i källan (${tone.confidence})`);

  // 2. Förstärkaren valdes av tumregel eller är vagt angiven
  if (notes.some((n) => n.includes('saknar regel – tumregel'))) {
    add('amp-fallback', 3, `förstärkaren ("${tone.amp || 'tom'}") matchade ingen regel – modellen valdes efter gain/genre`);
  } else if (notes.some((n) => n.includes('förstärkarfältet') && n.includes('är allmänt'))) {
    add('amp-vague', 1, `förstärkarfältet är allmänt ("${tone.amp}")`);
  }

  // 3. Osäkerhet om utrustningen i noteringarna
  if (GENERIC.test(tone.notes)) add('generic', 2, 'genretypisk tolkning – ingen utrustning dokumenterad');
  const hedges = [...new Set((tone.notes.match(HEDGES) ?? []).map((h) => h.toLowerCase()))];
  if (hedges.length) add('hedges', Math.min(2, hedges.length), `osäkra formuleringar: ${hedges.slice(0, 3).join(', ')}`);

  // 4. Basutrustning i gitarrens data (t.ex. Lemmys Rickenbacker) eller en basförstärkare som GP-200-modell
  const guitar = tone.guitar ?? '';
  if (ampModel && BASS_AMPS.has(ampModel)) {
    add('bass-amp-model', 4, `gitarrdelen fick basförstärkaren ${ampModel} (original "${tone.amp}")`);
  } else if (BASS_GUITAR.test(guitar) || BASS_AMP_TEXT.test(tone.amp)) {
    add('bass-gear', 3, `basutrustning i gitarrens data (gitarr "${guitar}", förstärkare "${tone.amp}")`);
  } else if (/rickenbacker(?!\s*\d{3})/i.test(guitar) && !/12|360|330|325|620/.test(guitar)) {
    add('rickenbacker', 2, `"Rickenbacker" utan modellnummer – kan vara en basgitarr (gitarr "${guitar}")`);
  }

  // 5. Modellen passar inte tiden
  const dec = decade(tone.era);
  if (dec !== undefined && dec <= 1970 && ampModel && MODERN_HIGH_GAIN.test(ampModel)) {
    add('era', 2, `${ampModel} (modern high gain) för en inspelning från ${dec}-talet`);
  }

  // 6. Gain passar inte genre/tontyp
  if (tone.toneType === 'distorted' && METAL_GENRE.test(tone.genre) && gain < 5) {
    add('genre-gain', 2, `${tone.genre} men bara gain ${gain}/10`);
  }
  if (SOFT_GENRE.test(tone.genre) && gain >= 7) add('genre-gain', 2, `${tone.genre} men gain ${gain}/10`);
  if (tone.toneType === 'clean' && gain >= 6) add('type-gain', 1, `ren del men gain ${gain}/10`);
  if (tone.toneType === 'distorted' && gain <= 3) add('type-gain', 1, `distad del men bara gain ${gain}/10`);
  if (tone.toneType === 'clean' && ampModel && HIGH_GAIN.test(ampModel)) {
    add('clean-highgain', 2, `ren del på high gain-modellen ${ampModel}`);
  }

  // 7. Källor
  const sources = tone.sources ?? [];
  if (sources.length === 0) add('sources', 2, 'inga källor');
  else if (sources.every((s) => WEAK_SOURCE.test(s))) add('sources', 1, 'bara forum-/videokällor');

  // 8. Saknade uppgifter
  if (!guitar.trim()) add('missing', 1, 'gitarr saknas');

  return { tone, ampModel, score: findings.reduce((sum, f) => sum + f.points, 0), findings };
}

export type RiskLevel = 'hög' | 'medel' | 'låg';
export const riskLevel = (score: number): RiskLevel => (score >= 6 ? 'hög' : score >= 3 ? 'medel' : 'låg');
