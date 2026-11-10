import { BLOCK_ORDER } from '../types';
import type { GeneratedPreset } from '../types';

/** Textformat enligt CLAUDE.md §4 – alla block, i fast ordning. */
export function formatPreset(preset: GeneratedPreset): string {
  const lines: string[] = [`## ${preset.title}`, ''];
  for (const block of BLOCK_ORDER) {
    const b = preset.blocks[block];
    lines.push(`**${block}:** ${b.enabled ? 'ON' : 'OFF'}`);
    lines.push(`Model: ${b.model ?? '–'}`);
    const params = Object.entries(b.params ?? {});
    lines.push(`Settings: ${params.length ? '' : '–'}`);
    for (const [k, v] of params) lines.push(`  ${k}: ${v}`);
    lines.push('');
  }
  const g = preset.guitarNotes;
  if (g && Object.keys(g).length) {
    lines.push('### Gitarr');
    if (g.pickup) lines.push(`Mick: ${g.pickup}`);
    if (g.guitarVolume) lines.push(`Volym: ${g.guitarVolume}`);
    if (g.guitarTone) lines.push(`Tone: ${g.guitarTone}`);
    if (g.other) lines.push(g.other);
    lines.push('');
  }
  if (preset.footswitch) lines.push(`Fotswitch: ${preset.footswitch}`, '');
  if (preset.routing) lines.push(`Routing: ${preset.routing}`, '');
  if (preset.translationNotes?.length) {
    lines.push('### Så valdes inställningarna');
    for (const n of preset.translationNotes) lines.push(`- ${n}`);
    lines.push('');
  }
  if (preset.confidence !== undefined) {
    lines.push(`Källans säkerhet: ${Math.round(preset.confidence * 100)} %`);
  }
  if (preset.sourceUrl) lines.push(`Källa: ${preset.sourceUrl}`);
  if (preset.attribution) lines.push(preset.attribution);
  lines.push('Obs: parameternamn följer manualen; värdena är rekommenderade startvärden – justera på gehör.');
  for (const issue of preset.issues) {
    lines.push(`${issue.level === 'error' ? 'FEL' : 'Varning'}: ${issue.message}`);
  }
  return lines.join('\n');
}
