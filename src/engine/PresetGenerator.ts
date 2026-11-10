import { BLOCK_ORDER } from '../types';
import type {
  BlockSetting,
  BlockSettings,
  FullBlockSettings,
  GeneratedPreset,
  Song,
  SongPart,
  ToneProfile,
} from '../types';
import { GP200Validator } from './GP200Validator';

const OFF: BlockSetting = { enabled: false };

/** Slår ihop profil + override. Byts modellen nollställs profilens parametrar. */
export function mergeBlock(base: BlockSetting | undefined, override: BlockSetting | undefined): BlockSetting {
  if (!override) return base ? { ...base, params: { ...base.params } } : { ...OFF };
  if (!base) return { ...override, params: { ...override.params } };
  const modelChanged = override.model !== undefined && override.model !== base.model;
  return {
    enabled: override.enabled,
    model: override.model ?? base.model,
    params: modelChanged ? { ...override.params } : { ...base.params, ...override.params },
    note: override.note ?? base.note,
  };
}

export function mergeBlocks(base: BlockSettings, override: BlockSettings = {}): FullBlockSettings {
  const result = {} as FullBlockSettings;
  for (const block of BLOCK_ORDER) {
    result[block] = mergeBlock(base[block], override[block]);
  }
  return result;
}

/** Bygger ett komplett, validerat preset för en låtdel. Ingen AI – bara data + regler. */
export class PresetGenerator {
  constructor(
    private readonly profiles: ToneProfile[],
    private readonly validator: GP200Validator,
  ) {}

  profile(id: string): ToneProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  generate(song: Song, part: SongPart): GeneratedPreset {
    const profile = part.profile ? this.profile(part.profile) : undefined;
    const blocks = mergeBlocks(profile?.blocks ?? {}, part.overrides);
    const issues = this.validator.validate(blocks);
    if (part.profile && !profile) {
      issues.unshift({ level: 'error', message: `Profilen "${part.profile}" finns inte i tone-profiles.json.` });
    }
    const guitarNotes = Object.fromEntries(
      Object.entries({ ...profile?.guitarNotes, ...part.guitarNotes }).filter(([, v]) => v),
    );
    return {
      songId: song.id,
      partId: part.id,
      title: `${song.artist} – ${song.title} (${part.name})`,
      blocks,
      footswitch: part.footswitch,
      guitarNotes,
      routing: song.routing,
      confidence: part.confidence,
      translationNotes: part.translationNotes,
      originalGear: part.originalGear ?? song.originalGear,
      sources: part.sources ?? song.sources,
      sourceUrl: part.sourceUrl,
      attribution: song.attribution,
      issues,
    };
  }

  generateAll(song: Song): GeneratedPreset[] {
    return song.parts.map((part) => this.generate(song, part));
  }
}
