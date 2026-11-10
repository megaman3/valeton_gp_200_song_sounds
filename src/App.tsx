import { useMemo, useState } from 'react';
import { allSongs, database, generator, searchSongs } from './engine';
import SongSearch from './components/SongSearch';
import PresetView from './components/PresetView';
import EffectChain from './components/EffectChain';
import OriginalGearView from './components/OriginalGearView';

const MAX_RESULTS = 50;

export default function App() {
  const [query, setQuery] = useState('');
  const [songId, setSongId] = useState<string>();
  const [partId, setPartId] = useState<string>();

  const results = useMemo(() => (query.trim() ? searchSongs(allSongs, query, MAX_RESULTS) : []), [query]);
  const song = allSongs.find((s) => s.id === songId);
  const part = song?.parts.find((p) => p.id === partId) ?? song?.parts[0];
  const preset = song && part ? generator.generate(song, part) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">GP-200 Tone Generator</h1>
        <p className="text-sm text-zinc-400">
          Skriv en låt och/eller artist. Inställningarna tas fram med regler – ingen AI. {allSongs.length} låtar i
          databasen.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <SongSearch
          query={query}
          onQueryChange={setQuery}
          songs={results}
          limit={MAX_RESULTS}
          selectedId={songId}
          onSelect={(id) => {
            setSongId(id);
            setPartId(undefined);
          }}
        />

        <main className="min-w-0 space-y-6">
          {song && part && preset ? (
            <>
              {song.parts.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {song.parts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPartId(p.id)}
                      className={`rounded px-3 py-1 text-sm ${
                        p.id === part.id ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              <EffectChain blocks={preset.blocks} />
              <PresetView preset={preset} />
              <OriginalGearView preset={preset} />
            </>
          ) : (
            <p className="text-zinc-400">Sök efter en låt, t.ex. "paranoid" eller "metallica".</p>
          )}
        </main>
      </div>

      <footer className="mt-10 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        Låtdata: <a className="underline" href={database.external.homepage}>GuitarToneAdapt</a> (
        <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>), normaliserad och
        översatt till GP-200-modeller. Modeller och parametrar: {database.manual.source}
      </footer>
    </div>
  );
}
