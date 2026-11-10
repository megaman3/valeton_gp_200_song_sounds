import { describe, expect, it } from 'vitest';
import { BLOCK_ORDER } from '../src/types';
import { allSongs, database, formatPreset, generator, searchSongs } from '../src/engine';
import { mergeBlock } from '../src/engine/PresetGenerator';

describe('PresetGenerator', () => {
  const sandman = database.curatedSongs.find((s) => s.id === 'metallica-enter-sandman')!;

  it('ger alltid alla tio block i rätt ordning', () => {
    const preset = generator.generate(sandman, sandman.parts[0]);
    expect(Object.keys(preset.blocks)).toEqual([...BLOCK_ORDER]);
  });

  it('override slår ihop parametrar med profilen', () => {
    const preset = generator.generate(sandman, sandman.parts[0]);
    expect(preset.blocks.AMP.model).toBe('Mess2C+ 1');
    expect(preset.blocks.AMP.params?.Gain).toBe(60);
    expect(preset.blocks.AMP.params?.Treble).toBe(62); // från profilen
  });

  it('modellbyte nollställer profilens parametrar', () => {
    const merged = mergeBlock(
      { enabled: true, model: 'Gate 1', params: { Threshold: 20 } },
      { enabled: true, model: 'Gate 2', params: { Release: 10 } },
    );
    expect(merged.params).toEqual({ Release: 10 });
  });

  it('formatPreset listar varje block', () => {
    const text = formatPreset(generator.generate(sandman, sandman.parts[0]));
    for (const block of BLOCK_ORDER) expect(text).toContain(`**${block}:**`);
  });
});

describe('searchSongs', () => {
  it('hittar på artist + titel, skiftlägesokänsligt', () => {
    expect(searchSongs(allSongs, 'metallica sandman')[0]?.id).toBe('metallica-enter-sandman');
    expect(searchSongs(allSongs, 'AC/DC back in black')[0]?.id).toBe('acdc-back-in-black');
  });

  it('hittar låtar som bara finns i det importerade datasetet', () => {
    const hit = searchSongs(allSongs, 'master of puppets')[0];
    expect(hit?.source).toBe('guitartoneadapt');
  });

  it('handskrivna låtar ersätter importerade med samma artist och titel', () => {
    expect(allSongs.filter((s) => /enter sandman/i.test(s.title) && /metallica/i.test(s.artist))).toHaveLength(1);
  });
});
