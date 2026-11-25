// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from '../src/components/PresetView';

afterEach(() => vi.unstubAllGlobals());

describe('Kopiera som text', () => {
  it('använder urklippet när det finns', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await copyText('hej')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hej');
  });

  it('faller tillbaka på execCommand när urklippet saknas (t.ex. http på telefonen)', async () => {
    vi.stubGlobal('navigator', {});
    document.execCommand = vi.fn().mockReturnValue(true);
    expect(await copyText('hej')).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('rapporterar misslyckande i stället för att kasta fel', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('nekad')) } });
    document.execCommand = vi.fn(() => {
      throw new Error('stöds inte');
    });
    expect(await copyText('hej')).toBe(false);
  });
});
