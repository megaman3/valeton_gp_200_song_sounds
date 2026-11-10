import type { Song } from '../types';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  songs: Song[];
  limit: number;
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function SongSearch({ query, onQueryChange, songs, limit, selectedId, onSelect }: Props) {
  return (
    <aside className="space-y-3">
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Låt och/eller artist…"
        className="w-full rounded bg-zinc-900 px-3 py-2 text-sm outline-none ring-1 ring-zinc-700 focus:ring-amber-500"
      />
      <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
        {songs.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={`w-full rounded px-3 py-2 text-left text-sm ${
                s.id === selectedId ? 'bg-zinc-800 ring-1 ring-amber-500' : 'hover:bg-zinc-900'
              }`}
            >
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-zinc-400">
                {s.artist}
                {s.year ? ` · ${s.year}` : ''}
                {s.source !== 'guitartoneadapt' ? ' · handskriven' : ''}
              </div>
            </button>
          </li>
        ))}
        {query.trim() && songs.length === 0 && <li className="text-sm text-zinc-500">Inga träffar.</li>}
        {songs.length === limit && <li className="text-xs text-zinc-500">Visar de {limit} första – förfina sökningen.</li>}
      </ul>
    </aside>
  );
}
