import { database } from './data';
import { GP200Validator } from './GP200Validator';
import { PresetGenerator } from './PresetGenerator';
import { ToneTranslator, songKey } from './ToneTranslator';
import type { Song } from '../types';

export const validator = new GP200Validator(database.models, database.manual);
export const generator = new PresetGenerator(database.profiles, validator);
export const translator = new ToneTranslator(database.rules, validator);

/**
 * Företräde vid samma artist+titel: handskrivna låtar → egen research → GuitarToneAdapt.
 */
const curatedKeys = new Set(database.curatedSongs.map((s) => songKey(s.artist, s.title)));
export const researchSongs: Song[] = translator.translateDataset(database.research, curatedKeys, 'research');
const takenKeys = new Set([...curatedKeys, ...researchSongs.map((s) => songKey(s.artist, s.title))]);
export const externalSongs: Song[] = translator.translateDataset(database.external, takenKeys);
export const allSongs: Song[] = [...database.curatedSongs, ...researchSongs, ...externalSongs];

export { database };
export { searchSongs } from './SongSearch';
export { formatPreset } from './formatPreset';
