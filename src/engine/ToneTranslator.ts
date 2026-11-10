import type {
  BlockSetting,
  BlockSettings,
  EffectRule,
  ExternalDataset,
  GearRule,
  MappingRules,
  ParamValue,
  ResearchedTone,
  Song,
  SongPart,
} from '../types';
import type { GP200Validator } from './GP200Validator';
import { findKeyword, normalizeText } from './matching';

/**
 * Regelbaserad översättning av researchade originalljud (förstärkare, rattar 0–10,
 * effekter) till GP-200-block. Ingen AI: varje beslut kommer från mapping-rules.json,
 * manualkatalogen eller en uttrycklig tumregel nedan, och förklaras i translationNotes.
 */

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));
const LIGHT = [' light ', ' subtle ', ' minimal ', ' low level ', ' occasional ', ' possible '];
const MIX_PARAMS = new Set(['Mix', 'Dly Mix', 'Dry/Wet']);
const EQ_WORDS = ['eq', 'equalizer', 'graphic eq', 'parametric eq', 'mid boost', 'upper mid'];
const FENDER_AMPS = /^(Dark |Tweedy|Silver Twin|Bellman)/;
const HEAVY_GENRES = ['metalcore', 'nu metal', 'djent', 'deathcore', 'death metal', 'black metal', 'progressive metal', 'groove metal'];

export interface GearMatch {
  rule: GearRule;
  model: string;
}

export class ToneTranslator {
  constructor(
    private readonly rules: MappingRules,
    private readonly validator: GP200Validator,
  ) {}

  // -------------------------------------------------------------------------
  // Utrustning
  // -------------------------------------------------------------------------

  /** Delar en förstärkarbeskrivning i förstärkar- resp. kabinettsdelar. */
  splitGearText(text: string): { amp: string[]; cab: string[] } {
    const segments = text
      .split(/[,;()+]|\s\/\s|\binto\b|\bthrough\b|\bthru\b|\bwith\b|\band\b|\bor\b|—|–/i)
      .map((s) => s.trim())
      .filter(Boolean);
    const isCab = (s: string) =>
      /\bcab(inet)?s?\b|\bspeakers?\b|greenback|g12/i.test(s) ||
      (/\d\s*x\s*\d{1,2}/i.test(s) && !/\bcombo\b|\bamp\b|\bhead\b/i.test(s));
    return { amp: segments.filter((s) => !isCab(s)), cab: segments.filter(isCab) };
  }

  /**
   * Första segment (i textens ordning) med en träff vinner. Inom ett segment vinner
   * första regeln i filordning – specifika modellregler står före generiska märkesregler.
   */
  matchGear(rules: GearRule[], segments: string[], gain: number, era = ''): GearMatch | undefined {
    const vintage = isVintage(era);
    for (const segment of segments) {
      const text = normalizeText(segment);
      const rule = rules.find((r) => findKeyword(text, r.match).index !== -1);
      if (!rule) continue;
      const model =
        (vintage && rule.vintage) ||
        rule.model ||
        rule.byGain?.find((g) => gain <= g.maxGain)?.model ||
        rule.byGain?.at(-1)?.model;
      if (model) return { rule, model };
    }
    return undefined;
  }

  /** Tumregel när förstärkaren inte kan identifieras. */
  fallbackAmp(gain: number, genre: string, era = ''): { model: string; reason: string } {
    const g = normalizeText(genre);
    if (gain <= 3.5) return { model: 'Dark Twin', reason: 'clean (gain ≤ 3,5)' };
    if (gain <= 5.5) return { model: 'UK 45', reason: 'lätt crunch (gain ≤ 5,5)' };
    if (isVintage(era) && gain <= 8.5) return { model: 'UK SLP', reason: `rock från ${era} (Plexi-era)` };
    if (gain <= 7) return { model: 'UK SLP', reason: 'klassisk rock-crunch (gain ≤ 7)' };
    if (gain <= 8.5) return { model: 'UK 800', reason: 'hårdrock (gain ≤ 8,5)' };
    if (HEAVY_GENRES.some((h) => g.includes(` ${h} `))) {
      return { model: 'Mess DualM', reason: `modern metal-genre (${genre})` };
    }
    if (g.includes(' metal ')) return { model: 'EV 51', reason: `metal (${genre})` };
    return { model: 'UK 900', reason: 'mycket hög gain' };
  }

  /** Översätter rattvärden 0–10 till de parametrar som modellen faktiskt har. */
  ampParams(model: string, tone: ResearchedTone, notes: string[]): Record<string, ParamValue> {
    const s = tone.ampSettings;
    const entry = this.validator.manualEntry('AMP', model);
    const factor = entry?.type === 'Hi Gain' ? 0.75 : entry?.type === 'Drive' ? 0.9 : 1;
    const gain = clamp(s.gain * 10 * factor, 5);
    const candidates: Record<string, ParamValue> = {
      Gain: gain,
      'Gain 1': gain,
      'Gain 2': clamp(gain * 0.6),
      Input: 50,
      Bass: clamp(s.bass * 10),
      Middle: clamp(s.mid * 10),
      Midrange: clamp(s.mid * 10),
      Treble: clamp(s.treble * 10),
      Presence: clamp(s.presence * 10),
      Tone: clamp(s.treble * 10),
      'Tone 1': clamp(s.treble * 10),
      'Tone 2': clamp(s.treble * 10),
      'Tone Cut': clamp(100 - s.treble * 10),
      Edge: 50,
      Volume: 60,
      Bright: 'OFF',
      Char: s.gain >= 6 ? 'Hot' : 'Cool',
    };
    const params: Record<string, ParamValue> = {};
    for (const def of entry?.params ?? []) {
      if (def.name in candidates) params[def.name] = candidates[def.name];
    }
    if (factor < 1) {
      notes.push(
        `AMP Gain: originalets ${s.gain}/10 × 10 × ${factor} = ${gain} (${entry?.type}-modeller har mer förstärkning i sig).`,
      );
    }
    const has = (n: string) => (entry?.params ?? []).some((p) => p.name === n);
    if (!has('Presence') && s.presence !== 5) notes.push(`${model} saknar Presence-ratt (original ${s.presence}/10).`);
    return params;
  }

  // -------------------------------------------------------------------------
  // Effekter
  // -------------------------------------------------------------------------

  private applyEffectRule(rule: EffectRule, effectText: string, ampGain: number): BlockSetting {
    let params = { ...(ampGain >= 6 && rule.paramsHighGain ? rule.paramsHighGain : rule.params) };
    if (LIGHT.some((w) => effectText.includes(w))) {
      params = Object.fromEntries(
        Object.entries(params).map(([k, v]) =>
          [k, typeof v === 'number' && MIX_PARAMS.has(k) ? clamp(v * 0.6) : v] as const,
        ),
      );
    }
    return { enabled: true, model: rule.model, params, note: rule.reason };
  }

  // -------------------------------------------------------------------------
  // Huvudfunktion
  // -------------------------------------------------------------------------

  translateTone(tone: ResearchedTone): { blocks: BlockSettings; notes: string[] } {
    const notes: string[] = [];
    const blocks: BlockSettings = {};
    const s = tone.ampSettings;
    const isClean = tone.toneType === 'clean';
    const gear = this.splitGearText(tone.amp);

    // --- AMP: förstärkarfältet först; annars förstärkare som nämns bland effekterna
    let ampMatch = this.matchGear(this.rules.amp, [...gear.amp, ...gear.cab], s.gain, tone.era);
    if (!ampMatch) {
      const ampEffects = tone.effects.filter((e) => /\bamp\b|amplifier|preamp/i.test(e));
      ampMatch = this.matchGear(this.rules.amp, ampEffects.flatMap((e) => this.splitGearText(e).amp), s.gain, tone.era);
      if (ampMatch) notes.push(`AMP: förstärkarfältet ("${tone.amp}") är allmänt – modellen hittades i effektlistan.`);
    }
    const acoustic = !ampMatch && normalizeText(tone.amp).includes(' acoustic ');
    let ampModel: string;
    if (acoustic) {
      ampModel = 'Dark Twin';
      notes.push('Akustiskt original: PRE AC Sim simulerar akustisk gitarr från elgitarr, AMP Dark Twin hålls ren.');
    } else if (ampMatch) {
      ampModel = ampMatch.model;
      notes.push(`AMP: "${tone.amp}" → ${ampModel}. ${ampMatch.rule.reason}`);
    } else {
      const fb = this.fallbackAmp(s.gain, tone.genre, tone.era);
      ampModel = fb.model;
      notes.push(
        `AMP: förstärkaren${tone.amp ? ` ("${tone.amp}")` : ''} saknar regel – tumregel: ${fb.model} för ${fb.reason}.`,
      );
    }
    const ampTone = acoustic ? { ...tone, ampSettings: { ...s, gain: 2 } } : tone;
    blocks.AMP = { enabled: true, model: ampModel, params: this.ampParams(ampModel, ampTone, notes) };

    // --- CAB
    const cabMatch = this.matchGear(this.rules.cab, gear.cab, s.gain);
    const defaultCab = this.validator.manualEntry('AMP', ampModel)?.defaultCab ?? undefined;
    if (cabMatch) {
      blocks.CAB = { enabled: true, model: cabMatch.model, params: { Volume: 50 } };
      notes.push(`CAB: "${gear.cab.join(', ')}" → ${cabMatch.model}. ${cabMatch.rule.reason}`);
    } else if (defaultCab) {
      blocks.CAB = { enabled: true, model: defaultCab, params: { Volume: 50 } };
      notes.push(
        gear.cab.length
          ? `CAB: "${gear.cab.join(', ')}" saknar regel – ${defaultCab} passar ${ampModel} (som Auto CAB Match).`
          : `CAB: inget kabinett angivet – ${defaultCab} passar ${ampModel} (som Auto CAB Match).`,
      );
    }

    // --- Effekter
    const effectTexts = tone.effects.map((e) => normalizeText(e));
    const used = new Set<number>();
    for (const rule of this.rules.effects) {
      if (blocks[rule.block]) continue;
      if (rule.maxAmpGain !== undefined && s.gain > rule.maxAmpGain) continue;
      const idx = effectTexts.findIndex((t) => findKeyword(t, rule.match).index !== -1);
      if (idx === -1) continue;
      used.add(idx);
      blocks[rule.block] = this.applyEffectRule(rule, effectTexts[idx], s.gain);
      notes.push(`${rule.block}: "${tone.effects[idx]}" → ${rule.model}.`);
    }

    // --- EQ: uttryckligen nämnd, eller för att kompensera saknad Middle-ratt
    const eqIdx = effectTexts.findIndex((t) => findKeyword(t, EQ_WORDS).index !== -1);
    const ampHasMiddle = (this.validator.manualEntry('AMP', ampModel)?.params ?? []).some((p) =>
      ['Middle', 'Midrange'].includes(p.name),
    );
    if (eqIdx !== -1) {
      used.add(eqIdx);
      const midBoost = /mid|upper/.test(effectTexts[eqIdx]) && !/scoop|cut/.test(effectTexts[eqIdx]);
      blocks.EQ = {
        enabled: true,
        model: 'Guitar EQ 1',
        params: midBoost || s.mid > 3.5
          ? { '125 Hz': 0, '400 Hz': 0, '800 Hz': 6, '1.6 kHz': 8, '4 kHz': 0, Volume: 0 }
          : { '125 Hz': 6, '400 Hz': -4, '800 Hz': -10, '1.6 kHz': 0, '4 kHz': 6, Volume: 0 },
      };
      notes.push(`EQ: "${tone.effects[eqIdx]}" → Guitar EQ 1 (${midBoost || s.mid > 3.5 ? 'mellanregisterlyft' : 'V-formad'}).`);
    } else if (!ampHasMiddle && Math.abs(s.mid - 5) >= 2) {
      const v = clamp((s.mid - 5) * 6, -50, 50);
      blocks.EQ = {
        enabled: true,
        model: 'Guitar EQ 1',
        params: { '125 Hz': 0, '400 Hz': v, '800 Hz': v, '1.6 kHz': 0, '4 kHz': 0, Volume: 0 },
      };
      notes.push(`EQ: ${ampModel} saknar Middle-ratt – originalets mid ${s.mid}/10 läggs på 400/800 Hz (${v}).`);
    }

    // --- Distorsion som kommer från förstärkaren
    effectTexts.forEach((t, i) => {
      if (!used.has(i) && t.includes(' distortion ') && s.gain > 5.5) {
        used.add(i);
        notes.push(`"${tone.effects[i]}": distorsionen kommer från förstärkaren (gain ${s.gain}/10) – ingen DST-pedal.`);
      }
    });

    // --- NR
    if (!blocks.NR && !isClean && s.gain >= 6) {
      blocks.NR = { enabled: true, model: 'Gate 1', params: { Threshold: clamp(20 + (s.gain - 6) * 8) } };
      notes.push(`NR: Gate 1 eftersom gain är ${s.gain}/10.`);
    }

    // --- RVB: regel + förstärkarens reverb-ratt
    const fender = FENDER_AMPS.test(ampModel);
    if (blocks.RVB?.model === 'Room' && fender && blocks.RVB.note?.startsWith('Reverb utan')) {
      blocks.RVB = { enabled: true, model: 'Spring', params: { Mix: 25, Decay: 40, Tone: 50 }, note: 'Fjäderreverb, som i Fender-förstärkare.' };
    }
    if (!blocks.RVB && s.reverb >= 2) {
      blocks.RVB = fender
        ? { enabled: true, model: 'Spring', params: { Mix: 25, Decay: 40, Tone: 50 } }
        : { enabled: true, model: 'Room', params: { Mix: 15, 'Pre Delay': 10, Decay: 35 } };
      notes.push(`RVB: förstärkarens reverb ${s.reverb}/10 → ${blocks.RVB.model}.`);
    }
    if (blocks.RVB?.params && 'Mix' in blocks.RVB.params && s.reverb > 0) {
      blocks.RVB.params.Mix = clamp(s.reverb * 4, 8, 40);
    }

    // --- Akustisk
    if (acoustic) {
      blocks.PRE = { enabled: true, model: 'AC Sim', params: { Body: 50, Top: 55, Volume: 50, Mode: 'Standard' } };
    }

    // --- Effekter utan regel
    tone.effects.forEach((e, i) => {
      if (used.has(i)) return;
      const blocked = this.rules.effects.find(
        (r) => findKeyword(effectTexts[i], r.match).index !== -1 && blocks[r.block],
      );
      if (/\bamp\b|amplifier|preamp|profile|archetype|kemper|axe fx|helix/.test(effectTexts[i])) {
        notes.push(`"${e}": beskriver förstärkaren, inte en effekt – täcks av AMP-blocket.`);
      } else if (blocked) {
        notes.push(
          `"${e}": ${blocked.block}-blocket används redan (${blocks[blocked.block]?.model}). ` +
            `Alternativ: ${blocked.model} – byt modell eller gör ett extra preset.`,
        );
      } else if (findKeyword(effectTexts[i], this.rules.ignoredEffects).index !== -1) {
        notes.push(`"${e}": saknar motsvarighet i GP-200 eller är för vagt angiven – hoppas över.`);
      } else {
        notes.push(`"${e}": ingen regel matchade – kontrollera på gehör.`);
      }
    });

    return { blocks, notes };
  }

  // -------------------------------------------------------------------------
  // Dataset → låtar
  // -------------------------------------------------------------------------

  private partName(tone: ResearchedTone): string {
    const base: Record<string, string> = { riff: 'Rhythm / Riff', solo: 'Lead / Solo', clean: 'Clean', main: 'Rhythm' };
    return base[tone.part] ?? (tone.toneType === 'clean' ? 'Clean' : 'Rhythm');
  }

  toPart(tone: ResearchedTone): SongPart {
    const { blocks, notes } = this.translateTone(tone);
    return {
      id: `${tone.part}-${tone.toneType}`,
      name: this.partName(tone),
      overrides: blocks,
      confidence: tone.confidence,
      translationNotes: notes,
      guitarNotes: {
        pickup: tone.pickup || undefined,
        other: tone.guitar ? `Originalgitarr: ${tone.guitar}` : undefined,
      },
      originalGear: { amp: tone.amp ? [tone.amp] : [], guitar: tone.guitar, notes: tone.notes, pedals: tone.effects },
      sources: tone.sources,
      sourceUrl: tone.url,
    };
  }

  translateDataset(dataset: ExternalDataset, skipKeys = new Set<string>()): Song[] {
    const songs = new Map<string, Song>();
    const order = ['riff', 'main', 'distorted', 'clean', 'solo'];
    const sorted = [...dataset.tones].sort((a, b) => order.indexOf(a.part) - order.indexOf(b.part));
    for (const tone of sorted) {
      const key = songKey(tone.artist, tone.song);
      if (skipKeys.has(key)) continue;
      let song = songs.get(key);
      if (!song) {
        song = {
          id: `gta-${key}`,
          artist: tone.artist,
          title: tone.song,
          genre: tone.genre,
          parts: [],
          source: 'guitartoneadapt',
          attribution: dataset.attribution,
        };
        songs.set(key, song);
      }
      const part = this.toPart(tone);
      const sameName = song.parts.filter((p) => p.name === part.name).length;
      if (song.parts.some((p) => p.id === part.id)) part.id = `${part.id}-${song.parts.length + 1}`;
      if (sameName > 0) part.name = `${part.name} (${tone.toneType}${sameName > 1 ? ` ${sameName + 1}` : ''})`;
      song.parts.push(part);
    }
    return [...songs.values()];
  }
}

function isVintage(era: string): boolean {
  return /\b19[67]0s?\b|\b19[67]\d\b/.test(era);
}

export function songKey(artist: string, title: string): string {
  return normalizeText(`${artist} ${title}`).trim().replace(/ /g, '-');
}

