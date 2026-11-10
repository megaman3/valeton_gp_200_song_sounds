import { describe, expect, it } from 'vitest';
import { BLOCK_ORDER } from '../src/types';
import { allSongs, database, generator, validator } from '../src/engine';

describe('GP200Validator', () => {
  it('känner igen modeller från användarens lista', () => {
    expect(validator.modelExists('AMP', 'UK SLP')).toBe(true);
    expect(validator.modelExists('AMP', 'Marshall JCM800')).toBe(false);
  });

  it('flaggar EQ utanför -50…+50 som fel', () => {
    const issues = validator.validateBlock('EQ', { enabled: true, model: 'Guitar EQ 1', params: { '125 Hz': 60 } });
    expect(issues.some((i) => i.level === 'error')).toBe(true);
  });

  it('flaggar ON-block utan modell', () => {
    expect(validator.validateBlock('DLY', { enabled: true })[0]?.level).toBe('error');
  });

  it('flaggar parametrar som modellen inte har enligt manualen', () => {
    // Dark Twin saknar Presence (manualen s. 39), Gate 1 har bara Threshold (s. 52)
    const twin = validator.validateBlock('AMP', { enabled: true, model: 'Dark Twin', params: { Presence: 50 } });
    expect(twin.some((i) => i.level === 'error')).toBe(true);
    const gate = validator.validateBlock('NR', { enabled: true, model: 'Gate 1', params: { Decay: 40 } });
    expect(gate.some((i) => i.level === 'error')).toBe(true);
  });

  it('kräver ON/OFF för switchar', () => {
    const issues = validator.validateBlock('AMP', { enabled: true, model: 'Dark Twin', params: { Bright: 1 } });
    expect(issues.some((i) => i.level === 'error')).toBe(true);
  });
});

describe('Databasens integritet', () => {
  it('modellistan har alla tio block och inga dubbletter', () => {
    for (const block of BLOCK_ORDER) {
      const list = database.models.blocks[block];
      expect(list.length).toBeGreaterThan(0);
      expect(new Set(list).size).toBe(list.length);
    }
  });

  it('modellistan och manualkatalogen innehåller exakt samma modeller', () => {
    for (const block of BLOCK_ORDER) {
      expect(Object.keys(database.manual.blocks[block]).sort()).toEqual([...database.models.blocks[block]].sort());
    }
  });

  it('AMP-modellernas rekommenderade kabinett finns', () => {
    for (const [model, entry] of Object.entries(database.manual.blocks.AMP)) {
      if (entry.defaultCab) expect(validator.modelExists('CAB', entry.defaultCab), model).toBe(true);
    }
  });

  it('alla profiler är fria från fel', () => {
    for (const profile of database.profiles) {
      expect(validator.validate(profile.blocks).filter((i) => i.level === 'error'), profile.id).toEqual([]);
    }
  });

  it('alla mappningsregler pekar på existerande modeller med giltiga parametrar', () => {
    const { amp, cab, effects } = database.rules;
    for (const r of amp) {
      for (const m of [r.model, ...(r.byGain ?? []).map((g) => g.model)].filter(Boolean) as string[]) {
        expect(validator.modelExists('AMP', m), m).toBe(true);
      }
    }
    for (const r of cab) expect(validator.modelExists('CAB', r.model!), r.model).toBe(true);
    for (const r of effects) {
      for (const params of [r.params, r.paramsHighGain].filter(Boolean)) {
        const errors = validator
          .validateBlock(r.block, { enabled: true, model: r.model, params })
          .filter((i) => i.level === 'error');
        expect(errors, `${r.block} ${r.model}`).toEqual([]);
      }
    }
  });

  it('ALLA genererade presets (handskrivna + importerade) är fria från fel', () => {
    let count = 0;
    for (const song of allSongs) {
      for (const preset of generator.generateAll(song)) {
        count++;
        expect(preset.issues.filter((i) => i.level === 'error'), preset.title).toEqual([]);
      }
    }
    expect(count).toBeGreaterThan(1000);
  });

  it('låt-id:n är unika', () => {
    const ids = allSongs.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
