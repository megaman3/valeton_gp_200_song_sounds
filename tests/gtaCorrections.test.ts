import { describe, expect, it } from 'vitest';
import { applyCorrections, gtaCorrections } from '../src/engine/data';
import { allSongs } from '../src/engine';
import type { ExternalDataset } from '../src/types';
import gtaRaw from '../src/data/external/guitartoneadapt.json';

const base = {
  source: '', sourceUrl: '', homepage: '', license: '', attribution: '', importedAt: '', count: 1,
  tones: [{ id: 'x', artist: 'A', song: 'S', genre: '', era: '', toneType: 'distorted', part: 'riff',
    ampSettings: { gain: 7, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 1 }, amp: 'Marshall', guitar: 'Fel gitarr',
    notes: 'Original.', effects: [], pickup: 'bridge', confidence: 0.6, sources: ['https://a'], url: '' }],
} as ExternalDataset;

describe('GuitarToneAdapt-rättelser', () => {
  it('ersätter fält, lägger till notering och källor utan dubbletter', () => {
    const [t] = applyCorrections(base, { description: '', corrections: [
      { id: 'x', set: { guitar: 'Rätt gitarr', confidence: 0.5 }, appendNote: 'Rättat.', addSources: ['https://a', 'https://b'], reason: '' },
    ] }).tones;
    expect(t).toMatchObject({ guitar: 'Rätt gitarr', confidence: 0.5, notes: 'Original. Rättat.', sources: ['https://a', 'https://b'] });
    expect(base.tones[0].guitar).toBe('Fel gitarr'); // originalet orört
  });

  it('alla rättelser pekar på existerande toner', () => {
    // Mot originalfilen – uteslutna toner finns inte i den rättade datan.
    const ids = new Set((gtaRaw as { tones: { id: string }[] }).tones.map((t) => t.id));
    for (const c of gtaCorrections.corrections) expect(ids.has(c.id), c.id).toBe(true);
  });

  it('Ace of Spades har Stratocaster (inte Lemmys Rickenbacker)', () => {
    const ace = allSongs.find((s) => s.title === 'Ace of Spades')!;
    expect(ace.parts[0].originalGear?.guitar).toBe('Fender Stratocaster');
    expect(ace.parts[0].confidence).toBe(0.5);
  });

  it('kan utesluta toner och markera granskade regler', () => {
    const two = { ...base, tones: [base.tones[0], { ...base.tones[0], id: 'y' }] } as ExternalDataset;
    const out = applyCorrections(two, { description: '', corrections: [
      { id: 'x', exclude: true, reason: '' },
      { id: 'y', reviewed: ['bass-gear'], reason: '' },
    ] }).tones;
    expect(out.map((t) => t.id)).toEqual(['y']);
    expect(out[0].reviewed).toEqual(['bass-gear']);
  });

  it('basljud som hamnat bland gitarrljuden är borttagna', () => {
    expect(allSongs.some((s) => s.artist === 'Nirvana' && s.title === 'Breed')).toBe(false);
    expect(allSongs.some((s) => s.title === 'Given Up')).toBe(false);
  });
});

