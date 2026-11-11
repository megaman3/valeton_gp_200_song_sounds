import type { Song } from '../types';

interface Props {
  songs: Song[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onRemove: (song: Song) => void;
}

/** Listan under fliken "Favorites". Nyast först. */
export default function FavoritesList({ songs, selectedId, onSelect, onRemove }: Props) {
  if (songs.length === 0) {
    return (
      <p className="rounded bg-zinc-900/80 p-3 text-sm text-zinc-400 ring-1 ring-zinc-800 backdrop-blur-sm">
        Inga favoriter än. Öppna en låt eller ljudtyp och tryck på ☆ vid namnet för att spara den här. Favoriterna
        sparas bara på den här enheten.
      </p>
    );
  }
  return (
    <ul aria-label="Favoriter" className="max-h-[70vh] space-y-1 overflow-y-auto">
      {songs.map((s) => (
        <li key={s.id} className="flex items-stretch gap-1">
          <button
            onClick={() => onSelect(s.id)}
            className={`min-w-0 flex-1 rounded px-3 py-2 text-left text-sm ${
              s.id === selectedId ? 'bg-zinc-800/80 ring-1 ring-amber-500' : 'hover:bg-zinc-900/80'
            }`}
          >
            <div className="truncate font-medium">{s.title}</div>
            <div className="truncate text-xs text-zinc-400">
              {s.artist}
              {s.year ? ` · ${s.year}` : ''}
            </div>
          </button>
          <button
            onClick={() => onRemove(s)}
            aria-label={`Ta bort ${s.title} från favoriter`}
            title="Ta bort från favoriter"
            className="shrink-0 rounded px-3 text-amber-400 hover:bg-zinc-900/80 hover:text-zinc-300"
          >
            ★
          </button>
        </li>
      ))}
    </ul>
  );
}
