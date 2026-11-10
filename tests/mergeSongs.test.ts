import { mergeSongs } from '../src/engine';
import type { Song } from '../src/types';

const song = (id: string, parts: { id: string; name: string }[]): Song => ({
  id,
  artist: 'Metallica',
  title: 'One',
  parts: parts.map((p) => ({ ...p })),
});

describe('mergeSongs', () => {
  it('lägger till researchdelar i befintlig låt utan att ta bort något', () => {
    const base = [song('gta-one', [{ id: 'riff-distorted', name: 'Rhythm / Riff' }])];
    const extra = [song('res-one', [{ id: 'clean-clean', name: 'Clean' }])];
    const [merged] = mergeSongs(base, extra);
    expect(merged.id).toBe('gta-one');
    expect(merged.parts.map((p) => p.id)).toEqual(['riff-distorted', 'clean-clean']);
  });

  it('döper om krockande del-id och namn', () => {
    const base = [song('gta-one', [{ id: 'solo-distorted', name: 'Lead / Solo' }])];
    const extra = [song('res-one', [{ id: 'solo-distorted', name: 'Lead / Solo' }])];
    const [merged] = mergeSongs(base, extra);
    expect(merged.parts[1]).toMatchObject({ id: 'solo-distorted-research', name: 'Lead / Solo (egen research)' });
  });

  it('behåller låtar som bara finns i research', () => {
    const extra = [{ ...song('res-x', [{ id: 'riff-distorted', name: 'Rhythm / Riff' }]), title: 'Whiplash' }];
    expect(mergeSongs([], extra)).toHaveLength(1);
  });
});
