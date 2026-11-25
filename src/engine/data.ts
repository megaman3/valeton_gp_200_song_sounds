import modelsJson from '../data/gp200-models.json';
import manualJson from '../data/gp200-manual.json';
import profilesJson from '../data/tone-profiles.json';
import songsJson from '../data/songs.json';
import rulesJson from '../data/mapping-rules.json';
import gtaJson from '../data/external/guitartoneadapt.json';
import gtaCorrectionsJson from '../data/external/gta-corrections.json';
import researchJson from '../data/research/research-tones.json';
import type {
  ExternalDataset,
  GP200Manual,
  GP200ModelList,
  MappingRules,
  ToneCorrections,
  Song,
  ToneProfile,
} from '../types';

/** Lägger egna rättelser ovanpå ett importerat dataset (påverkar inte originalfilen). */
export function applyCorrections(dataset: ExternalDataset, corrections: ToneCorrections): ExternalDataset {
  const byId = new Map(corrections.corrections.map((c) => [c.id, c]));
  return {
    ...dataset,
    tones: dataset.tones.filter((tone) => !byId.get(tone.id)?.exclude).map((tone) => {
      const c = byId.get(tone.id);
      if (!c) return tone;
      return {
        ...tone,
        ...c.set,
        reviewed: c.reviewed ?? tone.reviewed,
        notes: [tone.notes, c.appendNote].filter(Boolean).join(' '),
        sources: [...tone.sources, ...(c.addSources ?? []).filter((s) => !tone.sources.includes(s))],
      };
    }),
  };
}

export const gtaCorrections = gtaCorrectionsJson as ToneCorrections;

/** Samlad, typad åtkomst till all JSON-data. */
export interface ToneDatabase {
  models: GP200ModelList;
  manual: GP200Manual;
  profiles: ToneProfile[];
  curatedSongs: Song[];
  rules: MappingRules;
  external: ExternalDataset;
  /** Egen research för artister som saknas i externa källor (samma format). */
  research: ExternalDataset;
}

export const database: ToneDatabase = {
  models: modelsJson as GP200ModelList,
  manual: manualJson as unknown as GP200Manual,
  profiles: profilesJson as unknown as ToneProfile[],
  curatedSongs: songsJson as unknown as Song[],
  rules: rulesJson as unknown as MappingRules,
  external: applyCorrections(gtaJson as ExternalDataset, gtaCorrections),
  research: researchJson as ExternalDataset,
};
