import { describe, expect, it } from 'vitest';
import { translator } from '../src/engine';
import { decade, riskLevel, scanTone } from '../src/engine/QualityScan';
import type { ResearchedTone } from '../src/types';

const tone = (over: Partial<ResearchedTone> = {}): ResearchedTone => ({
  id: 't', artist: 'A', song: 'S', genre: 'rock', era: '1990s', toneType: 'distorted', part: 'riff',
  ampSettings: { gain: 7, bass: 5, mid: 6, treble: 6, presence: 6, reverb: 1 },
  amp: 'Marshall JCM800', guitar: 'Gibson Les Paul', notes: 'Studio recording.', effects: [],
  pickup: 'bridge humbucker', confidence: 0.8, sources: ['https://www.guitarworld.com/x'], url: '', ...over,
});
const scan = (over: Partial<ResearchedTone> = {}) => {
  const t = tone(over);
  return scanTone(t, translator.toPart(t));
};
const rules = (over: Partial<ResearchedTone> = {}) => scan(over).findings.map((f) => f.rule);

describe('kvalitetsskanning', () => {
  it('ett väldokumenterat preset får låg poäng', () => {
    const s = scan();
    expect(s.findings).toEqual([]);
    expect(riskLevel(s.score)).toBe('låg');
  });

  it('flaggar låg säkerhet, okänd förstärkare, genretypisk tolkning och saknad gitarr', () => {
    const s = scan({ confidence: 0.3, amp: 'Unknown', guitar: '', notes: 'Genretypisk tolkning.' });
    expect(s.findings.map((f) => f.rule)).toEqual(expect.arrayContaining(['confidence', 'amp-fallback', 'generic', 'missing']));
    expect(riskLevel(s.score)).toBe('hög');
  });

  it('hittar basutrustning – men inte Marshall Super Bass eller rattläget "Bass 3"', () => {
    expect(rules({ guitar: 'Höfner 500/1 Violin Bass' })).toContain('bass-gear');
    expect(rules({ amp: 'Ampeg SVT-CL through 8x10' })).toContain('bass-amp-model');
    expect(rules({ amp: 'Marshall Super Bass 100 (Bass 3, Treble 7)' })).not.toContain('bass-gear');
    expect(rules({ guitar: 'Rickenbacker / Marshall' })).toContain('rickenbacker');
    expect(rules({ guitar: 'Rickenbacker 325' })).not.toContain('rickenbacker');
  });

  it('hittar fel epok och ren del på high gain-modell', () => {
    expect(rules({ era: '1970s', amp: 'Peavey 5150', ampSettings: { gain: 8, bass: 5, mid: 5, treble: 6, presence: 6, reverb: 1 } })).toContain('era');
    // Översättningen byter själv till en ren kanal, så regeln testas med en konstruerad del.
    const clean = tone({ toneType: 'clean', ampSettings: { gain: 2, bass: 5, mid: 6, treble: 6, presence: 6, reverb: 2 } });
    const onHighGain = scanTone(clean, { id: 'p', name: 'p', overrides: { AMP: { enabled: true, model: 'EV 51' } } });
    expect(onHighGain.findings.map((f) => f.rule)).toContain('clean-highgain');
    // JCM800 har bara en kanal – en ren del på UK 800 är autentisk och flaggas inte.
    const onJcm = scanTone(clean, { id: 'p', name: 'p', overrides: { AMP: { enabled: true, model: 'UK 800' } } });
    expect(onJcm.findings.map((f) => f.rule)).not.toContain('clean-highgain');
  });

  it('osäkra formuleringar räknas högst två gånger och forumkällor flaggas', () => {
    const s = scan({ notes: 'Likely a Marshall, possibly a Vox, probably debated.', sources: ['https://www.reddit.com/r/Guitar/x'] });
    expect(s.findings.find((f) => f.rule === 'hedges')?.points).toBe(2);
    expect(s.findings.map((f) => f.rule)).toContain('sources');
  });

  it('läser årtionde ur olika epokformat', () => {
    expect(decade('1970s')).toBe(1970);
    expect(decade('1980s (early 1980s)')).toBe(1980);
    expect(decade('2010s+')).toBe(2010);
    expect(decade('')).toBeUndefined();
  });

  it('granskade regler flaggas inte och hög säkerhet utan källor fångas', () => {
    expect(rules({ guitar: 'Rickenbacker', reviewed: ['rickenbacker'] })).not.toContain('rickenbacker');
    expect(rules({ confidence: 0.8, notes: 'No direct sources found for the amp.' })).toContain('conf-mismatch');
    expect(rules({ era: '1970s', amp: 'Mesa/Boogie Mark I' })).not.toContain('era'); // Boogie fanns ~1970
  });
});

