import type { Song, SongPart } from '../types';

/**
 * Etikett som visar vad ett preset bygger på – så att man ser vilka presets som mest
 * behöver provas och justeras på gehör. Regelbaserad: bygger bara på källa och säkerhet.
 */
export type BasisKey = 'user' | 'handmade' | 'soundType' | 'documented' | 'partial' | 'estimate';

export interface BasisLabel {
  key: BasisKey;
  text: string;
  description: string;
}

/** Säkerhetsgränser (källans egen säkerhet, 0–1). */
export const DOCUMENTED_FROM = 0.75;
export const PARTIAL_FROM = 0.4;

const LABELS: Record<BasisKey, Omit<BasisLabel, 'key'>> = {
  user: { text: 'Dina inställningar', description: 'Inställningar du själv tagit fram och lagt in.' },
  handmade: { text: 'Handskriven', description: 'Handskrivet preset i projektet, byggt på känd utrustning – rattlägena är startvärden.' },
  soundType: { text: 'Ljudtyp', description: 'Generellt grundljud, inte en specifik låt – värdena är startvärden.' },
  documented: {
    text: 'Dokumenterad utrustning',
    description: 'Originalutrustningen är väl belagd i källorna. Rattlägena är ändå startvärden – justera på gehör.',
  },
  partial: {
    text: 'Delvis dokumenterad',
    description: 'Artistens utrustning är belagd, men inte säkert för just den här låten. Prova och justera.',
  },
  estimate: {
    text: 'Uppskattning',
    description: 'Ingen eller osäker dokumentation – genretypisk tolkning. Lita mer på örat än på värdena.',
  },
};

export function basisLabel(song: Song, part: SongPart): BasisLabel {
  const key: BasisKey =
    part.author === 'user'
      ? 'user'
      : song.source === 'profile'
        ? 'soundType'
        : part.confidence === undefined
          ? 'handmade'
          : part.confidence >= DOCUMENTED_FROM
            ? 'documented'
            : part.confidence >= PARTIAL_FROM
              ? 'partial'
              : 'estimate';
  return { key, ...LABELS[key] };
}

/** Låtens etikett i listor: den bäst underbyggda delen (egna inställningar går först). */
export function songBasisLabel(song: Song): BasisLabel {
  const order: BasisKey[] = ['user', 'documented', 'handmade', 'partial', 'soundType', 'estimate'];
  return song.parts
    .map((p) => basisLabel(song, p))
    .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))[0] ?? basisLabel(song, { id: '', name: '' });
}

/** Tailwind-klasser per etikett (samma färg i lista och låtvy). */
export const BASIS_STYLE: Record<BasisKey, string> = {
  user: 'bg-sky-500/20 text-sky-300 ring-sky-500/40',
  handmade: 'bg-violet-500/20 text-violet-300 ring-violet-500/40',
  soundType: 'bg-amber-500/20 text-amber-300 ring-amber-500/40',
  documented: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40',
  partial: 'bg-yellow-500/15 text-yellow-200 ring-yellow-500/40',
  estimate: 'bg-rose-500/15 text-rose-300 ring-rose-500/40',
};
