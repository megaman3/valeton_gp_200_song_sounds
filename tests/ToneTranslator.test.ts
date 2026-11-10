import { describe, expect, it } from 'vitest';
import { translator } from '../src/engine';
import type { ResearchedTone } from '../src/types';

const tone = (over: Partial<ResearchedTone>): ResearchedTone => ({
  id: 't',
  artist: 'A',
  song: 'S',
  genre: 'rock',
  era: '1980s',
  toneType: 'distorted',
  part: 'riff',
  ampSettings: { gain: 7, bass: 5, mid: 5, treble: 6, presence: 5, reverb: 0 },
  amp: '',
  guitar: '',
  notes: '',
  effects: [],
  pickup: 'bridge',
  confidence: 0.8,
  sources: [],
  url: '',
  ...over,
});

describe('ToneTranslator – förstärkare', () => {
  it('väljer modell enligt manualens förebild', () => {
    expect(translator.translateTone(tone({ amp: 'Marshall JCM800 2203 head' })).blocks.AMP?.model).toBe('UK 800');
    expect(translator.translateTone(tone({ amp: 'Peavey 5150' })).blocks.AMP?.model).toBe('EV 51');
    expect(translator.translateTone(tone({ amp: 'Fender Twin Reverb' })).blocks.AMP?.model).toBe('Dark Twin');
  });

  it('första nämnda förstärkaren vinner, kabinett ignoreras vid förstärkarval', () => {
    const r = translator.translateTone(
      tone({ amp: 'Mesa/Boogie Mark IIC+ (preamp) into Marshall JCM800 (power amp), Mesa 4x12 cabinet' }),
    );
    expect(r.blocks.AMP?.model).toBe('Mess2C+ 1');
    expect(r.blocks.CAB?.model).toBe('Mess');
  });

  it('väljer kanal efter gain', () => {
    const lo = translator.translateTone(tone({ amp: 'Soldano SLO-100', ampSettings: { gain: 2, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    const hi = translator.translateTone(tone({ amp: 'Soldano SLO-100', ampSettings: { gain: 9, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    expect(lo.blocks.AMP?.model).toBe('Solo100 CL');
    expect(hi.blocks.AMP?.model).toBe('Solo100 LD');
  });

  it('använder tumregel när förstärkaren är okänd', () => {
    const r = translator.translateTone(tone({ amp: 'Unknown tube amp', genre: 'metalcore', ampSettings: { gain: 9, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    expect(r.blocks.AMP?.model).toBe('Mess DualM');
    expect(r.notes.join(' ')).toContain('tumregel');
  });

  it('sätter bara parametrar som modellen har', () => {
    const r = translator.translateTone(tone({ amp: 'Fender Twin Reverb' }));
    expect(r.blocks.AMP?.params).not.toHaveProperty('Presence');
    expect(r.blocks.AMP?.params).toHaveProperty('Middle');
  });
});

describe('ToneTranslator – effekter', () => {
  it('Tube Screamer framför high gain blir ren boost', () => {
    const r = translator.translateTone(tone({ amp: 'Peavey 5150', effects: ['Tube Screamer-style boost'], ampSettings: { gain: 9, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    expect(r.blocks.DST).toMatchObject({ model: 'Green OD', params: { Gain: 10 } });
  });

  it('"distortion" vid hög gain kommer från förstärkaren', () => {
    const r = translator.translateTone(tone({ amp: 'Marshall JCM800', effects: ['distortion'], ampSettings: { gain: 8, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    expect(r.blocks.DST).toBeUndefined();
  });

  it('mappar wah, chorus, delay och reverb', () => {
    const r = translator.translateTone(tone({ effects: ['Cry Baby wah', 'chorus', 'analog delay', 'spring reverb'] }));
    expect(r.blocks.WHA?.model).toBe('C-Wah');
    expect(r.blocks.MOD?.model).toBe('A-Chorus');
    expect(r.blocks.DLY?.model).toBe('Analog');
    expect(r.blocks.RVB?.model).toBe('Spring');
  });

  it('"light" sänker mixen', () => {
    const r = translator.translateTone(tone({ effects: ['light delay'] }));
    expect(r.blocks.DLY?.params?.Mix).toBeLessThan(18);
  });

  it('noise gate slås på automatiskt vid hög gain', () => {
    const r = translator.translateTone(tone({ ampSettings: { gain: 9, bass: 5, mid: 5, treble: 5, presence: 5, reverb: 0 } }));
    expect(r.blocks.NR?.enabled).toBe(true);
  });
});
