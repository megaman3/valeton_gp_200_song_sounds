import { database } from './data';
import { GP200Validator } from './GP200Validator';
import { PresetGenerator } from './PresetGenerator';
import { ToneTranslator, songKey } from './ToneTranslator';
import type { Song } from '../types';

export const validator = new GP200Validator(database.models, database.manual);
export const generator = new PresetGenerator(database.profiles, validator);
export const translator = new ToneTranslator(database.rules, validator);

/**
 * Handskrivna låtar har företräde – samma artist+titel från andra källor hoppas över.
 * Egen research kompletterar GuitarToneAdapt: finns låten i båda läggs researchdelarna
 * (t.ex. ett rent intro) till efter de befintliga delarna i stället för att ersätta dem.
 */
const curatedKeys = new Set(database.curatedSongs.map((s) => songKey(s.artist, s.title)));
export const researchSongs: Song[] = translator.translateDataset(database.research, curatedKeys, 'research');
export const externalSongs: Song[] = translator.translateDataset(database.external, curatedKeys);
export const allSongs: Song[] = [...database.curatedSongs, ...mergeSongs(externalSongs, researchSongs)];

/**
 * Ljudtyper ("Jazz clean", "Djent / modern metal" …) är profilerna i tone-profiles.json
 * presenterade som sökbara poster. Taggar och beskrivning blir sökord, så "clean",
 * "blues" eller "high gain" hittar dem.
 */
export const soundTypes: Song[] = database.profiles.map((p) => ({
  id: `sound-${p.id}`,
  artist: 'Ljudtyp',
  title: p.name,
  genre: p.tags[0],
  aliases: [...p.tags, p.description],
  source: 'profile',
  parts: [{ id: 'main', name: 'Grundinställning', profile: p.id }],
}));

/** Allt som går att söka på: ljudtyper först, sedan låtar. */
export const searchable: Song[] = [...soundTypes, ...allSongs];

export function mergeSongs(base: Song[], extra: Song[]): Song[] {
  const byKey = new Map(base.map((s) => [songKey(s.artist, s.title), s]));
  const result = [...base];
  for (const song of extra) {
    const target = byKey.get(songKey(song.artist, song.title));
    if (!target) {
      result.push(song);
      continue;
    }
    const merged: Song = {
      ...target,
      parts: [...target.parts],
      attribution: [target.attribution, song.attribution].filter(Boolean).join(' · '),
    };
    for (const part of song.parts) {
      const ids = new Set(merged.parts.map((p) => p.id));
      const names = new Set(merged.parts.map((p) => p.name));
      merged.parts.push({
        ...part,
        id: ids.has(part.id) ? `${part.id}-research` : part.id,
        name: names.has(part.name) ? `${part.name} (egen research)` : part.name,
      });
    }
    result[result.indexOf(target)] = merged;
    byKey.set(songKey(song.artist, song.title), merged);
  }
  return result;
}

export { database };
export { searchSongs } from './SongSearch';
export { formatPreset } from './formatPreset';
