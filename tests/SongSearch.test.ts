import { allSongs, searchSongs } from '../src/engine';

describe('searchSongs', () => {
  it('hittar artist oavsett mellanslag', () => {
    const spaced = searchSongs(allSongs, 'White Snake').map((s) => s.id);
    expect(spaced.length).toBeGreaterThan(0);
    expect(searchSongs(allSongs, 'whitesnake').map((s) => s.id)).toEqual(spaced);
  });

  it('hittar AC/DC när man skriver ihop', () => {
    const acdc = searchSongs(allSongs, 'acdc');
    expect(acdc.length).toBe(allSongs.filter((s) => s.artist === 'AC/DC').length);
    expect(acdc.every((s) => s.artist === 'AC/DC')).toBe(true);
  });
});
