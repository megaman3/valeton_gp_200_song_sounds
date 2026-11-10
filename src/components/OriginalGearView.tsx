import type { GeneratedPreset } from '../types';

export default function OriginalGearView({ preset }: { preset: GeneratedPreset }) {
  const gear = preset.originalGear;
  const notes = preset.translationNotes ?? [];
  if (!gear && notes.length === 0) return null;
  return (
    <section className="space-y-3 rounded bg-zinc-900 p-3 text-sm">
      {gear && (
        <div>
          <h3 className="mb-1 font-semibold">Originalutrustning (referens)</h3>
          {gear.amp && gear.amp.length > 0 && <div>Förstärkare: {gear.amp.join(', ')}</div>}
          {gear.guitar && <div>Gitarr: {gear.guitar}</div>}
          {gear.pickups && <div>Mickar: {gear.pickups}</div>}
          {gear.pedals && gear.pedals.length > 0 && <div>Effekter: {gear.pedals.join(', ')}</div>}
          {gear.notes && <p className="mt-1 text-zinc-400">{gear.notes}</p>}
        </div>
      )}
      {notes.length > 0 && (
        <div>
          <h3 className="mb-1 font-semibold">Så valdes inställningarna</h3>
          <ul className="list-disc space-y-0.5 pl-5 text-zinc-300">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
      {(preset.confidence !== undefined || preset.sourceUrl || preset.sources?.length) && (
        <div className="text-xs text-zinc-400">
          {preset.confidence !== undefined && <div>Källans säkerhet: {Math.round(preset.confidence * 100)} %</div>}
          {preset.sourceUrl && (
            <div>
              Källa:{' '}
              <a className="underline" href={preset.sourceUrl} target="_blank" rel="noreferrer">
                {preset.sourceUrl}
              </a>
            </div>
          )}
          {preset.sources && preset.sources.length > 0 && (
            <details>
              <summary className="cursor-pointer">Underliggande källor ({preset.sources.length})</summary>
              <ul className="pl-4">
                {preset.sources.map((s) => (
                  <li key={s}>
                    <a className="underline" href={s} target="_blank" rel="noreferrer">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
