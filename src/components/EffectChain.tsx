import { BLOCK_ORDER } from '../types';
import type { FullBlockSettings } from '../types';

export default function EffectChain({ blocks }: { blocks: FullBlockSettings }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      {BLOCK_ORDER.map((id, i) => {
        const b = blocks[id];
        return (
          <div key={id} className="flex items-center gap-1">
            <div
              className={`rounded px-2 py-1 text-center ${
                b.enabled ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'
              }`}
              title={b.model ?? 'OFF'}
            >
              <div className="font-bold">{id}</div>
              <div className="max-w-[80px] truncate">{b.enabled ? b.model : 'OFF'}</div>
            </div>
            {i < BLOCK_ORDER.length - 1 && <span className="text-zinc-600">→</span>}
          </div>
        );
      })}
    </div>
  );
}
