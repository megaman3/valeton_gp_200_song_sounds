import { describe, expect, it } from 'vitest';
import { allSongs, basisLabel, formatPreset, generator, soundTypes, songBasisLabel } from '../src/engine';
import type { Song } from '../src/types';

const find = (artist: string, title: string) => allSongs.find((s) => s.artist === artist && s.title === title)!;
const song = (parts: Song['parts'], source?: Song['source']): Song => ({ id: 's', artist: 'A', title: 'T', parts, source });

describe('etikett för underlaget', () => {
  it('följer källans säkerhet', () => {
    expect(basisLabel(song([]), { id: 'a', name: 'a', confidence: 0.8 }).key).toBe('documented');
    expect(basisLabel(song([]), { id: 'a', name: 'a', confidence: 0.5 }).key).toBe('partial');
    expect(basisLabel(song([]), { id: 'a', name: 'a', confidence: 0.3 }).key).toBe('estimate');
  });

  it('skiljer dina inställningar, handskrivna presets och ljudtyper åt', () => {
    const whiskey = find('Metallica', 'Whiskey in the Jar');
    expect(basisLabel(whiskey, whiskey.parts[0]).text).toBe('Dina inställningar');
    const sandman = find('Metallica', 'Enter Sandman');
    expect(basisLabel(sandman, sandman.parts[0]).key).toBe('handmade');
    expect(songBasisLabel(soundTypes[0]).key).toBe('soundType');
  });

  it('My Little RnR: dina delar och den researchade delen får olika etiketter, låten visas som din', () => {
    const rnr = find('Danko Jones', 'My Little RnR');
    expect(rnr.parts.map((p) => basisLabel(rnr, p).key)).toEqual(['user', 'user', 'partial']);
    expect(songBasisLabel(rnr).key).toBe('user');
  });

  it('underlaget följer med i texten från "Kopiera som text"', () => {
    const basket = find('Green Day', 'Basket Case');
    expect(formatPreset(generator.generate(basket, basket.parts[0]))).toContain('Underlag: Dokumenterad utrustning');
  });
});
