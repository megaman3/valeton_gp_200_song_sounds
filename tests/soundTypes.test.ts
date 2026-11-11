import { describe, expect, it } from 'vitest';
import { database, generator, searchable, searchSongs, soundTypes } from '../src/engine';

describe('Ljudtyper', () => {
  it('finns en ljudtyp per profil och alla ger presets utan fel', () => {
    expect(soundTypes).toHaveLength(database.profiles.length);
    for (const s of soundTypes) {
      const [preset] = generator.generateAll(s);
      expect(preset.issues.filter((i) => i.level === 'error'), s.title).toEqual([]);
    }
  });

  it('hittas på taggar och svenska sökord, före låtar', () => {
    expect(searchSongs(searchable, 'clean')[0].source).toBe('profile');
    expect(searchSongs(searchable, 'djent').map((s) => s.title)).toContain('Djent / modern metal');
    expect(searchSongs(searchable, 'ren').some((s) => s.title === 'Jazz clean')).toBe(true);
    expect(searchSongs(searchable, 'ljudtyp')).toHaveLength(soundTypes.length);
  });

  it('EQ-band håller sig inom -50..+50', () => {
    for (const p of database.profiles) {
      for (const v of Object.values(p.blocks.EQ?.params ?? {})) {
        if (typeof v === 'number') expect(Math.abs(v)).toBeLessThanOrEqual(50);
      }
    }
  });
});
