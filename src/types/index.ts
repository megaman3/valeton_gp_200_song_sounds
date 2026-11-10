/**
 * Kärntyper för GP-200 Tone Generator.
 *
 * All logik är regelbaserad – ingen AI används. Presets byggs från JSON-data
 * (låtar, externa ljuddata, ljudprofiler och mappningsregler) och valideras mot
 * användarens modellista (gp200-models.json) och Valetons manual (gp200-manual.json).
 */

/** Blocken i den ordning de ALLTID presenteras (CLAUDE.md §4). */
export const BLOCK_ORDER = [
  'NR',
  'DST',
  'AMP',
  'CAB',
  'EQ',
  'DLY',
  'RVB',
  'PRE',
  'WHA',
  'MOD',
] as const;

export type BlockId = (typeof BLOCK_ORDER)[number];

export type ParamValue = number | string;

/** Inställning för ett block i ett preset/profil. */
export interface BlockSetting {
  enabled: boolean;
  /** Exakt modellnamn enligt gp200-models.json. Krävs när enabled = true. */
  model?: string;
  /** Parameternamn (enligt manualen) → värde. Switchar anges som "ON"/"OFF". */
  params?: Record<string, ParamValue>;
  /** Fri text: varför modellen valts, hur den används (t.ex. fotswitch). */
  note?: string;
}

export type BlockSettings = Partial<Record<BlockId, BlockSetting>>;

/** Ett komplett preset – alla tio block finns alltid med. */
export type FullBlockSettings = Record<BlockId, BlockSetting>;

// ---------------------------------------------------------------------------
// GP-200-data
// ---------------------------------------------------------------------------

/** Användarens modellista (CLAUDE.md §13) – whitelist. */
export interface GP200ModelList {
  source: string;
  blocks: Record<BlockId, string[]>;
}

export type ParamKind = 'knob' | 'switch' | 'select';

export interface ParamDefinition {
  name: string;
  kind: ParamKind;
  min?: number;
  max?: number;
  /** true = intervallet är bekräftat (manualen eller CLAUDE.md). */
  rangeConfirmed?: boolean;
  unit?: string;
}

/** En modell enligt Valetons manual. */
export interface ManualModel {
  type: string;
  basedOn: string | null;
  params: ParamDefinition[];
  manualPage: number | null;
  /** Namnet som det skrivs i manualen, om det skiljer sig från användarens lista. */
  manualName?: string;
  /** Parametrarna är härledda från en syskonmodell (manualen listar dem inte separat). */
  paramsInferred?: boolean;
  /** Modellen finns i användarens lista men inte i manualen. */
  missingInManual?: boolean;
  /** AMP: rekommenderat kabinett (motsvarar Auto CAB Match). */
  defaultCab?: string | null;
}

export interface GP200Manual {
  source: string;
  sourceUrl: string;
  defaultSignalChain: string[];
  notes: string[];
  blocks: Record<BlockId, Record<string, ManualModel>>;
}

// ---------------------------------------------------------------------------
// Ljudprofiler, låtar och mappningsregler
// ---------------------------------------------------------------------------

/** En återanvändbar "arketyp", t.ex. Plexi-crunch eller Mesa-high-gain. */
export interface ToneProfile {
  id: string;
  name: string;
  description: string;
  tags: string[];
  blocks: BlockSettings;
  guitarNotes?: GuitarNotes;
}

export interface GuitarNotes {
  pickup?: string;
  guitarVolume?: string;
  guitarTone?: string;
  other?: string;
}

export interface OriginalGear {
  guitar?: string;
  pickups?: string;
  amp?: string[];
  cab?: string[];
  pedals?: string[];
  notes?: string;
}

/** En del av en låt: Rhythm, Lead, Clean, Intro … */
export interface SongPart {
  id: string;
  name: string;
  /** Profil att utgå från. Saknas den används enbart `overrides`. */
  profile?: string;
  /** Block-för-block-justeringar ovanpå profilen. Slås ihop per parameter. */
  overrides?: BlockSettings;
  /** Hur delen nås från rytmljudet, t.ex. "Tryck på fotswitch för DLY". */
  footswitch?: string;
  guitarNotes?: GuitarNotes;
  /** 0–1: hur väldokumenterat originalljudet är (från extern källa). */
  confidence?: number;
  /** Förklaringar till varje regelbeslut i översättningen. */
  translationNotes?: string[];
  /** Originalutrustning och källor för just denna del. */
  originalGear?: OriginalGear;
  sources?: string[];
  sourceUrl?: string;
}

export type SongSource = 'curated' | 'guitartoneadapt';

export interface Song {
  id: string;
  artist: string;
  title: string;
  album?: string;
  year?: number;
  genre?: string;
  aliases?: string[];
  originalGear?: OriginalGear;
  parts: SongPart[];
  /** Rekommenderad blockordning om den skiljer sig från standard. */
  routing?: string;
  sources?: string[];
  /** Var låten kommer ifrån. Saknas = curated. */
  source?: SongSource;
  attribution?: string;
}

/** Regel: originalförstärkare/kabinett → GP-200-modell. */
export interface GearRule {
  /** Nyckelord (matchas skiftlägesokänsligt, hela ord). */
  match: string[];
  /** Fast modell … */
  model?: string;
  /** … eller modell beroende på gain (0–10 i källdata). Första med gain ≤ maxGain vinner. */
  byGain?: { maxGain: number; model: string }[];
  /** Modell för inspelningar från 1960–70-talet (har företräde före byGain). */
  vintage?: string;
  reason: string;
  /** manual = förebilden står i Valetons manual; interpretation = närmaste val enligt projektet. */
  basis: 'manual' | 'interpretation';
}

/** Regel: effektbeskrivning → GP-200-block och modell. */
export interface EffectRule {
  match: string[];
  block: BlockId;
  model: string;
  params: Record<string, ParamValue>;
  /** Alternativa parametrar när förstärkarens gain (0–10) ≥ 6, t.ex. OD som ren boost. */
  paramsHighGain?: Record<string, ParamValue>;
  /** Regeln gäller bara om förstärkarens gain (0–10) är högst detta värde. */
  maxAmpGain?: number;
  reason: string;
  basis: 'manual' | 'interpretation';
}

export interface MappingRules {
  amp: GearRule[];
  cab: GearRule[];
  effects: EffectRule[];
  /** Effektord som medvetet saknar motsvarighet i GP-200 (t.ex. talk box). */
  ignoredEffects: string[];
}

/** Normaliserad post från en extern källa (t.ex. GuitarToneAdapt). Rattvärden 0–10. */
export interface ResearchedTone {
  id: string;
  artist: string;
  song: string;
  genre: string;
  era: string;
  toneType: string;
  part: string;
  ampSettings: {
    gain: number;
    bass: number;
    mid: number;
    treble: number;
    presence: number;
    reverb: number;
  };
  amp: string;
  guitar: string;
  notes: string;
  effects: string[];
  pickup: string;
  confidence: number;
  sources: string[];
  url: string;
}

export interface ExternalDataset {
  source: string;
  sourceUrl: string;
  homepage: string;
  license: string;
  attribution: string;
  importedAt: string;
  count: number;
  tones: ResearchedTone[];
}

// ---------------------------------------------------------------------------
// Resultat
// ---------------------------------------------------------------------------

export type IssueLevel = 'error' | 'warning';

export interface ValidationIssue {
  level: IssueLevel;
  block?: BlockId;
  message: string;
}

export interface GeneratedPreset {
  songId: string;
  partId: string;
  title: string;
  blocks: FullBlockSettings;
  footswitch?: string;
  guitarNotes?: GuitarNotes;
  routing?: string;
  confidence?: number;
  translationNotes?: string[];
  originalGear?: OriginalGear;
  sources?: string[];
  sourceUrl?: string;
  attribution?: string;
  issues: ValidationIssue[];
}
