import { useState } from 'react';
import { BLOCK_ORDER } from '../types';
import type { GeneratedPreset } from '../types';
import { formatPreset, validator } from '../engine';

/**
 * Kopierar text. navigator.clipboard finns bara i säkra sammanhang (https/localhost) och kan nekas –
 * då används den äldre execCommand-vägen via ett dolt textfält.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Nekad behörighet – prova reservvägen nedan.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export default function PresetView({ preset }: { preset: GeneratedPreset }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    setStatus((await copyText(formatPreset(preset))) ? 'copied' : 'failed');
    setTimeout(() => setStatus('idle'), 2000);
  };
  const g = preset.guitarNotes;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{preset.title}</h2>
        <button onClick={copy} className="rounded bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700">
          {status === 'copied' ? 'Kopierat!' : status === 'failed' ? 'Kunde inte kopiera' : 'Kopiera som text'}
        </button>
      </div>

      {preset.issues.length > 0 && (
        <ul className="space-y-1 text-sm">
          {preset.issues.map((issue, i) => (
            <li key={i} className={issue.level === 'error' ? 'text-red-400' : 'text-yellow-400'}>
              {issue.level === 'error' ? 'Fel' : 'Varning'}: {issue.message}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {BLOCK_ORDER.map((id) => {
          const b = preset.blocks[id];
          const defs = validator.paramDefinitions(id, b.model);
          return (
            <div key={id} className={`rounded p-3 ring-1 ${b.enabled ? 'ring-amber-500/60' : 'ring-zinc-800'}`}>
              <div className="flex items-baseline justify-between">
                <span className="font-bold">{id}</span>
                <span className={b.enabled ? 'text-amber-400' : 'text-zinc-500'}>{b.enabled ? 'ON' : 'OFF'}</span>
              </div>
              <div className="text-sm text-zinc-300">Model: {b.model ?? '–'}</div>
              {Object.entries(b.params ?? {}).length > 0 && (
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {Object.entries(b.params ?? {}).map(([k, v]) => {
                      const def = defs.find((d) => d.name === k);
                      const confirmed = !def || def.kind !== 'knob' || validator.paramRange(def).confirmed;
                      return (
                        <tr key={k}>
                          <td className="text-zinc-400">{k}</td>
                          <td className="text-right font-mono">
                            {v}
                            {!confirmed && <span title="Rekommenderat startvärde – intervallet är inte bekräftat"> *</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {b.note && <p className="mt-2 text-xs text-zinc-400">{b.note}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">Parameternamnen följer Valetons manual. * = rekommenderat startvärde; manualen anger inte reglagets intervall (antaget 0–100).</p>

      {g && Object.keys(g).length > 0 && (
        <div className="rounded bg-zinc-900/80 backdrop-blur-sm p-3 text-sm">
          <h3 className="mb-1 font-semibold">Gitarr (separat från GP-200)</h3>
          {g.pickup && <div>Mick: {g.pickup}</div>}
          {g.guitarVolume && <div>Volym: {g.guitarVolume}</div>}
          {g.guitarTone && <div>Tone: {g.guitarTone}</div>}
          {g.other && <div>{g.other}</div>}
        </div>
      )}
      {preset.footswitch && <p className="text-sm text-zinc-300">Fotswitch: {preset.footswitch}</p>}
      {preset.routing && <p className="text-sm text-zinc-300">Routing: {preset.routing}</p>}
    </section>
  );
}
