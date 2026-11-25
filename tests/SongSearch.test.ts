import { allSongs, search, searchSongs } from '../src/engine';
import { editDistance } from '../src/engine/SongSearch';

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

  it('tål stavfel när det inte finns exakta träffar', () => {
    const first = (q: string) => search(allSongs, q).songs[0];
    expect(first('wiskey')).toMatchObject({ artist: 'Metallica', title: 'Whiskey in the Jar' });
    expect(first('Wiskey jar')).toMatchObject({ title: 'Whiskey in the Jar' });
    expect(search(allSongs, 'wiskey').fuzzy).toBe(true);
    expect(first('metalica').artist).toBe('Metallica');
    expect(first('metallcia').artist).toBe('Metallica'); // omkastade bokstäver
    expect(first('slyer').artist).toBe('Slayer');
    expect(first('paranod').title).toBe('Paranoid');
  });

  it('hittar närmaste låt även när ett ord är för felstavat', () => {
    const first = (q: string) => search(allSongs, q).songs[0];
    // "yard" är två ändringar från "jar" – för mycket för stavfelssökningen, men resten av orden stämmer.
    expect(first('Whisky in the Yard')).toMatchObject({ artist: 'Metallica', title: 'Whiskey in the Jar' });
    expect(first('whisky yar')).toMatchObject({ title: 'Whiskey in the Jar' });
    // Ett ensamt ord som inte liknar något ger fortfarande inga träffar.
    expect(search(allSongs, 'zzzz qqqq').songs).toEqual([]);
  });

  it('exakta träffar går före och korta ord måste stavas rätt', () => {
    expect(search(allSongs, 'Whiskey').fuzzy).toBe(false);
    const exact = searchSongs(allSongs, 'metallica');
    expect(searchSongs(allSongs, 'metalica')).toEqual(exact);
    expect(search(allSongs, 'qzx').songs).toEqual([]);
  });
});

describe('editDistance', () => {
  it('räknar byten, tillägg, borttag och omkastningar', () => {
    expect(editDistance('wiskey', 'whiskey')).toBe(1);
    expect(editDistance('metallcia', 'metallica')).toBe(1);
    expect(editDistance('slyer', 'slayer')).toBe(1);
    expect(editDistance('abc', 'xyz')).toBe(3);
    expect(editDistance('abc', 'abcdefgh', 1)).toBe(2); // avbryter tidigt
  });
});
