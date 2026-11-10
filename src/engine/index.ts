import { database } from './data';
import { GP200Validator } from './GP200Validator';
import { PresetGenerator } from './PresetGenerator';
import { ToneTranslator, songKey } from './ToneTranslator';
import type { Song } from '../types';

export const validator = new GP200Validator(database.models, database.manual);
export const generator = new PresetGenerator(database.profiles, validator);
export const translator = new ToneTranslator(database.rules, validator);

/** Handskrivna låtar har företräde; externa låtar med samma artist+titel hoppas över. */
const curatedKeys = new Set(database.curatedSongs.map((s) => songKey(s.artist, s.title)));
export const externalSongs: Song[] = translator.translateDataset(database.external, curatedKeys);
export const allSongs: Song[] = [...database.curatedSongs, ...externalSongs];

export { database };
export { searchSongs } from './SongSearch';
export { formatPreset } from './formatPreset';
