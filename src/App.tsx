import { useMemo, useState } from 'react';
import { allSongs, database, generator, searchSongs } from './engine';
import SongSearch from './components/SongSearch';
import PresetView from './components/PresetView';
import EffectChain from './components/EffectChain';
import OriginalGearView from './components/OriginalGearView';
import bgEditor from './assets/bg-editor.jpeg';
import logoValeton from './assets/logo-valeton.jpeg';
import gp200LineArt from './assets/gp200-lineart.jpeg';

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
    <>
      {/* Bakgrund: GP-200-editorn, nedtonad så att texten förblir läsbar. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <img src={bgEditor} alt="" className="h-full w-full scale-105 object-cover opacity-40 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/85 to-zinc-950" />
      </div>

    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center gap-4 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 backdrop-blur-sm">
        <img src={logoValeton} alt="Valeton" className="h-14 w-14 shrink-0 rounded-md object-cover shadow-lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">GP-200 Tone Generator</h1>
          <p className="text-sm text-zinc-400">
            Skriv en låt och/eller artist. Inställningarna tas fram med regler – ingen AI. {allSongs.length} låtar i
            databasen.
          </p>
        </div>
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
            <div className="flex flex-col items-center gap-4 rounded-lg bg-black/60 p-6 text-center backdrop-blur-sm">
              <img src={gp200LineArt} alt="Valeton GP-200" className="w-full max-w-xs rounded-md opacity-90" />
              <p className="text-zinc-400">Sök efter en låt, t.ex. "paranoid" eller "metallica".</p>
            </div>
          )}
        </main>
      </div>

      <footer className="mt-10 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        Låtdata: <a className="underline" href={database.external.homepage}>GuitarToneAdapt</a> (
        <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>), normaliserad och
        översatt till GP-200-modeller. Kompletterande låtar: egen research med källor per låt. Modeller och parametrar: {database.manual.source}
      </footer>
    </div>
    </>
  );
}
