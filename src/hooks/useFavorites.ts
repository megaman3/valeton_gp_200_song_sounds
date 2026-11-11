import { useCallback, useEffect, useState } from 'react';
import type { Song } from '../types';
import { songKey } from '../engine/ToneTranslator';

/**
 * Favoriter sparas lokalt i webbläsaren (localStorage) på den enhet man använder –
 * ingen backend, inget konto, fungerar offline. Försvinner om man rensar webbplatsdata.
 *
 * Artist och titel sparas bredvid id:t så att en favorit hittas även om id:t
 * skulle ändras (t.ex. när en låt flyttar från egen research till GuitarToneAdapt).
 */
export const FAVORITES_KEY = 'gp200.favorites.v1';

export interface Favorite {
  id: string;
  artist: string;
  title: string;
  addedAt: string;
}

function load(): Favorite[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((f): f is Favorite => typeof f?.id === 'string') : [];
  } catch {
    return [];
  }
}

function save(favorites: Favorite[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Privat läge / blockerad lagring: favoriterna gäller då bara tills sidan stängs.
  }
}

/** Slår upp sparade favoriter bland dagens låtar (id först, annars artist + titel). */
export function resolveFavorites(favorites: Favorite[], songs: Song[]): Song[] {
  const byId = new Map(songs.map((s) => [s.id, s]));
  const byKey = new Map(songs.map((s) => [songKey(s.artist, s.title), s]));
  const result: Song[] = [];
  for (const f of favorites) {
    const song = byId.get(f.id) ?? byKey.get(songKey(f.artist, f.title));
    if (song && !result.includes(song)) result.push(song);
  }
  return result;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(load);

  // Håll flera öppna flikar i synk.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === FAVORITES_KEY && setFavorites(load());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((fn: (prev: Favorite[]) => Favorite[]) => {
    setFavorites((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const matches = (f: Favorite, song: Song) =>
    f.id === song.id || songKey(f.artist, f.title) === songKey(song.artist, song.title);

  const isFavorite = useCallback((song: Song) => favorites.some((f) => matches(f, song)), [favorites]);

  const toggle = useCallback(
    (song: Song) =>
      update((prev) =>
        prev.some((f) => matches(f, song))
          ? prev.filter((f) => !matches(f, song))
          : [{ id: song.id, artist: song.artist, title: song.title, addedAt: new Date().toISOString() }, ...prev],
      ),
    [update],
  );

  return { favorites, isFavorite, toggle };
}
