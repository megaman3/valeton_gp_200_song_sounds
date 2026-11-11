// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../src/App';
import { FAVORITES_KEY, resolveFavorites } from '../src/hooks/useFavorites';
import { searchable } from '../src/engine';

// Node 26 har ett eget (inaktiverat) localStorage som skuggar jsdom:s – använd en enkel minneslagring.
function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

const openFavoritesTab = () => fireEvent.click(screen.getByRole('tab', { name: /Favorites/ }));

describe('Favoriter', () => {
  it('sparar en låt lokalt, visar den under Favorites och minns den efter omstart', () => {
    const { unmount } = render(<App />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'jazz clean' } });
    fireEvent.click(within(screen.getByRole('listbox')).getAllByRole('button')[0]);
    fireEvent.click(screen.getByRole('button', { name: '☆ Spara som favorit' }));
    expect(screen.getByRole('button', { name: '★ Favorit' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: '★ Favorites (1)' })).toBeTruthy();

    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: 'sound-jazz-clean', title: 'Jazz clean' });

    unmount();
    render(<App />);
    openFavoritesTab();
    fireEvent.click(within(screen.getByRole('list', { name: 'Favoriter' })).getByText('Jazz clean'));
    expect(screen.getByRole('button', { name: '★ Favorit' })).toBeTruthy();
  });

  it('tar bort en favorit från listan', () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([{ id: 'sound-jazz-clean', artist: 'Ljudtyp', title: 'Jazz clean', addedAt: '' }]));
    render(<App />);
    openFavoritesTab();
    fireEvent.click(screen.getByRole('button', { name: 'Ta bort Jazz clean från favoriter' }));
    expect(screen.getByText(/Inga favoriter än/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY)!)).toEqual([]);
  });

  it('klarar trasig lagring och hittar låten via artist + titel om id:t ändrats', () => {
    localStorage.setItem(FAVORITES_KEY, '{trasig json');
    render(<App />);
    expect(screen.getByRole('tab', { name: '★ Favorites (0)' })).toBeTruthy();

    const song = searchable.find((s) => s.artist === 'Slayer' && s.title === 'Raining Blood')!;
    const resolved = resolveFavorites([{ id: 'gammalt-id', artist: 'slayer', title: 'raining blood', addedAt: '' }], searchable);
    expect(resolved).toEqual([song]);
  });
});
