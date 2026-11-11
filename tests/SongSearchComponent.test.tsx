// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import SongSearch from '../src/components/SongSearch';
import type { Song } from '../src/types';

const songs = Array.from({ length: 20 }, (_, i) => ({
  id: `s${i}`,
  artist: 'Iron Maiden',
  title: `Song ${i}`,
  parts: [],
})) as unknown as Song[];

function setViewport(narrow: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: narrow && q.includes('max-width'),
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
  Element.prototype.scrollIntoView = vi.fn();
}

function Harness() {
  const [query, setQuery] = useState('man');
  const [selected, setSelected] = useState<string>();
  const results = query ? songs : [];
  return (
    <SongSearch query={query} onQueryChange={setQuery} songs={results} limit={50} selectedId={selected} onSelect={setSelected} />
  );
}

const list = () => screen.getByRole('listbox', { hidden: true });

afterEach(cleanup);

describe('SongSearch – listan fälls ihop efter val', () => {
  it('döljer listan på telefon när en låt klickas och visar en knapp för att fälla ut', () => {
    setViewport(true);
    render(<Harness />);
    expect(list().className).not.toContain('hidden');
    fireEvent.click(screen.getByText('Song 3'));
    expect(list().className).toContain('hidden');
    expect(list().className).toContain('md:block'); // dator: listan ligger kvar i sidokolumnen
    fireEvent.click(screen.getByText('▾ Visa alla 20 träffar'));
    expect(list().className).not.toContain('hidden');
  });

  it('fäller ut listan igen när man trycker i eller skriver i sökfältet', () => {
    setViewport(true);
    render(<Harness />);
    const input = screen.getByRole('combobox');
    fireEvent.click(screen.getByText('Song 1'));
    expect(list().className).toContain('hidden');
    fireEvent.focus(input);
    expect(list().className).not.toContain('hidden');
    fireEvent.click(screen.getByText('Song 2'));
    fireEvent.change(input, { target: { value: 'maiden' } });
    expect(list().className).not.toContain('hidden');
  });

  it('Enter väljer och piltangent fäller ut listan igen', () => {
    setViewport(false);
    render(<Harness />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Song 1').closest('li')?.getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(list().className).not.toContain('hidden');
  });
});
