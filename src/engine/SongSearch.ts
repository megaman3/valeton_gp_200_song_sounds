import type { Song } from '../types';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

/**
 * Fritextsökning: alla sökord måste finnas i artist/titel/album/alias.
 * Träffar i titeln rankas före träffar enbart i artistnamnet.
 */
export function searchSongs(songs: Song[], query: string, limit = Infinity): Song[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return songs.slice(0, limit);
  const scored: { song: Song; score: number }[] = [];
  for (const song of songs) {
    const title = normalize(song.title);
    const haystack = normalize([song.artist, song.title, song.album ?? '', ...(song.aliases ?? [])].join(' '));
    // Ihopskrivet ska också hitta: "acdc" → "AC/DC", "whitesnake" → "White Snake".
    const compact = haystack.replace(/ /g, '');
    if (!terms.every((t) => haystack.includes(t) || compact.includes(t))) continue;
    let score = terms.filter((t) => title.includes(t)).length * 2;
    if (title === normalize(query)) score += 5;
    if (song.source === undefined || song.source === 'curated') score += 1;
    scored.push({ song, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.song.artist.localeCompare(b.song.artist))
    .slice(0, limit)
    .map((s) => s.song);
}
