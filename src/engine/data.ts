import modelsJson from '../data/gp200-models.json';
import manualJson from '../data/gp200-manual.json';
import profilesJson from '../data/tone-profiles.json';
import songsJson from '../data/songs.json';
import rulesJson from '../data/mapping-rules.json';
import gtaJson from '../data/external/guitartoneadapt.json';
import type {
  ExternalDataset,
  GP200Manual,
  GP200ModelList,
  MappingRules,
  Song,
  ToneProfile,
} from '../types';

/** Samlad, typad åtkomst till all JSON-data. */
export interface ToneDatabase {
  models: GP200ModelList;
  manual: GP200Manual;
  profiles: ToneProfile[];
  curatedSongs: Song[];
  rules: MappingRules;
  external: ExternalDataset;
}

export const database: ToneDatabase = {
  models: modelsJson as GP200ModelList,
  manual: manualJson as unknown as GP200Manual,
  profiles: profilesJson as unknown as ToneProfile[],
  curatedSongs: songsJson as unknown as Song[],
  rules: rulesJson as unknown as MappingRules,
  external: gtaJson as ExternalDataset,
};
