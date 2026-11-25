import type { Song } from '../types';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export interface SearchResult {
  songs: Song[];
  /** true = inga exakta träffar, resultaten bygger på stavfelstolerant sökning. */
  fuzzy: boolean;
}

/** Hur många bokstäver ett sökord får skilja sig: korta ord måste stavas rätt. */
function maxTypos(term: string): number {
  if (term.length < 4) return 0;
  return term.length < 8 ? 1 : 2;
}

/**
 * Antal ändringar (byta, lägga till, ta bort eller kasta om två bokstäver bredvid varandra)
 * mellan a och b. Avbryter tidigt när avståndet säkert överstiger `max`.
 */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur.push(v);
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/** Sökordet liknar ett ord i texten – hela ordet eller början av det (för halvskrivna ord). */
function fuzzyIncludes(words: string[], term: string): boolean {
  const max = maxTypos(term);
  if (max === 0) return false;
  return words.some(
    (w) =>
      editDistance(term, w, max) <= max ||
      (w.length > term.length && editDistance(term, w.slice(0, term.length), max) <= max),
  );
}

/**
 * Fritextsökning: alla sökord måste finnas i artist/titel/album/alias.
 * Träffar i titeln rankas före träffar enbart i artistnamnet.
 *
 * Ger det inga träffar görs en stavfelstolerant sökning: ord på 4–7 bokstäver får
 * skilja sig med en bokstav, längre ord med två ("wiskey" → Whiskey, "metalica" → Metallica).
 */
export function search(songs: Song[], query: string, limit = Infinity): SearchResult {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return { songs: songs.slice(0, limit), fuzzy: false };
  const exact = rank(songs, query, terms, false, limit);
  if (exact.length > 0 || terms.every((t) => maxTypos(t) === 0)) return { songs: exact, fuzzy: false };
  return { songs: rank(songs, query, terms, true, limit), fuzzy: true };
}

export function searchSongs(songs: Song[], query: string, limit = Infinity): Song[] {
  return search(songs, query, limit).songs;
}

function rank(songs: Song[], query: string, terms: string[], fuzzy: boolean, limit: number): Song[] {
  const scored: { song: Song; score: number }[] = [];
  for (const song of songs) {
    const title = normalize(song.title);
    const haystack = normalize([song.artist, song.title, song.album ?? '', ...(song.aliases ?? [])].join(' '));
    // Ihopskrivet ska också hitta: "acdc" → "AC/DC", "whitesnake" → "White Snake".
    const compact = haystack.replace(/ /g, '');
    const exactHit = (t: string) => haystack.includes(t) || compact.includes(t);
    const words = fuzzy ? haystack.split(' ') : [];
    if (!terms.every((t) => exactHit(t) || (fuzzy && fuzzyIncludes(words, t)))) continue;
    const titleWords = fuzzy ? title.split(' ') : [];
    let score = terms.filter((t) => title.includes(t) || (fuzzy && fuzzyIncludes(titleWords, t))).length * 2;
    if (title === normalize(query)) score += 5;
    if (song.source === undefined || song.source === 'curated' || song.source === 'profile') score += 1;
    scored.push({ song, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.song.artist.localeCompare(b.song.artist))
    .slice(0, limit)
    .map((s) => s.song);
}
