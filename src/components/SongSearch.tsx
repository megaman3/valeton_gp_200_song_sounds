import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Song } from '../types';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  songs: Song[];
  limit: number;
  selectedId?: string;
  onSelect: (id: string) => void;
}

/**
 * Sökfält + resultatlista. Tangentbord: ↑/↓ flyttar markeringen, Enter väljer,
 * Home/End hoppar till första/sista, Esc tömmer sökningen. Fokus stannar i sökfältet.
 */
export default function SongSearch({ query, onQueryChange, songs, limit, selectedId, onSelect }: Props) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Ny sökning → markera första träffen.
  useEffect(() => setActive(0), [songs]);

  // Håll den markerade raden synlig när man pilar i en lång lista.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onQueryChange('');
      return;
    }
    if (songs.length === 0) return;
    const last = songs.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: active >= last ? 0 : active + 1,
      ArrowUp: active <= 0 ? last : active - 1,
      Home: 0,
      End: last,
      PageDown: Math.min(last, active + 10),
      PageUp: Math.max(0, active - 10),
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelect(songs[Math.min(active, last)].id);
    }
  };

  const optionId = (i: number) => `song-option-${i}`;

  return (
    <aside className="space-y-3">
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Låt och/eller artist…"
        role="combobox"
        aria-expanded={songs.length > 0}
        aria-controls="song-results"
        aria-activedescendant={songs.length > 0 ? optionId(active) : undefined}
        className="w-full rounded bg-zinc-900/80 px-3 py-2 text-sm outline-none ring-1 ring-zinc-700 backdrop-blur-sm focus:ring-amber-500"
      />
      {songs.length > 0 && (
        <p className="hidden text-xs text-zinc-500 md:block">↑ ↓ för att bläddra, Enter för att välja, Esc för att rensa.</p>
      )}
      <ul ref={listRef} id="song-results" role="listbox" className="max-h-[70vh] space-y-1 overflow-y-auto">
        {songs.map((s, i) => {
          const isActive = i === active;
          const isSelected = s.id === selectedId;
          return (
            <li key={s.id} id={optionId(i)} data-index={i} role="option" aria-selected={isSelected}>
              <button
                tabIndex={-1}
                onClick={() => {
                  setActive(i);
                  onSelect(s.id);
                }}
                onMouseMove={() => !isActive && setActive(i)}
                className={`w-full rounded px-3 py-2 text-left text-sm ${
                  isSelected ? 'ring-1 ring-amber-500' : ''
                } ${isActive ? 'bg-zinc-700/80' : isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/80'}`}
              >
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-zinc-400">
                  {s.artist}
                  {s.year ? ` · ${s.year}` : ''}
                  {s.source === 'research' ? ' · egen research' : s.source !== 'guitartoneadapt' ? ' · handskriven' : ''}
                </div>
              </button>
            </li>
          );
        })}
        {query.trim() && songs.length === 0 && <li className="text-sm text-zinc-500">Inga träffar.</li>}
        {songs.length === limit && <li className="text-xs text-zinc-500">Visar de {limit} första – förfina sökningen.</li>}
      </ul>
    </aside>
  );
}
