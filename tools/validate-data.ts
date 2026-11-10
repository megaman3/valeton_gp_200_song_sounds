/**
 * Validerar all data mot GP-200-modellistan och manualen. Körs i CI.
 *   npm run validate-data            # sammanfattning
 *   npm run validate-data -- --all   # lista alla varningar
 */
import { BLOCK_ORDER } from '../src/types';
import { allSongs, database, generator, validator } from '../src/engine';

const showAll = process.argv.includes('--all');
let errors = 0;
const warnings = new Map<string, number>();

const error = (where: string, msg: string) => {
  errors++;
  console.log(`FEL     ${where}: ${msg}`);
};
const warn = (where: string, msg: string) => {
  warnings.set(msg, (warnings.get(msg) ?? 0) + 1);
  if (showAll) console.log(`VARNING ${where}: ${msg}`);
};

// 1. Användarens lista och manualen ska täcka samma modeller
for (const block of BLOCK_ORDER) {
  for (const model of database.models.blocks[block]) {
    if (!database.manual.blocks[block]?.[model]) error(`manual ${block}`, `"${model}" saknas i gp200-manual.json`);
  }
  for (const model of Object.keys(database.manual.blocks[block] ?? {})) {
    if (!validator.modelExists(block, model)) error(`manual ${block}`, `"${model}" finns inte i din modellista`);
  }
}

// 2. Regler pekar bara på existerande modeller
const { rules } = database;
for (const r of rules.amp) {
  for (const m of [r.model, ...(r.byGain ?? []).map((g) => g.model)].filter(Boolean) as string[]) {
    if (!validator.modelExists('AMP', m)) error(`amp-regel [${r.match[0]}]`, `"${m}" finns inte`);
  }
}
for (const r of rules.cab) {
  if (r.model && !validator.modelExists('CAB', r.model)) error(`cab-regel [${r.match[0]}]`, `"${r.model}" finns inte`);
}
for (const r of rules.effects) {
  for (const issue of validator.validateBlock(r.block, { enabled: true, model: r.model, params: r.params })) {
    if (issue.level === 'error') error(`effektregel [${r.match[0]}]`, issue.message);
  }
}

// 3. Alla genererade presets
let presets = 0;
for (const song of allSongs) {
  for (const preset of generator.generateAll(song)) {
    presets++;
    for (const issue of preset.issues) {
      if (issue.level === 'error') error(preset.title, issue.message);
      else warn(preset.title, issue.message);
    }
  }
}

console.log(
  `\n${allSongs.length} låtar (${database.curatedSongs.length} handskrivna, ${database.research.count} researchade toner), ${presets} presets, ` +
    `${rules.amp.length + rules.cab.length + rules.effects.length} regler.`,
);
if (warnings.size) {
  console.log(`Varningar (${[...warnings.values()].reduce((a, b) => a + b, 0)} st):`);
  for (const [msg, n] of [...warnings.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${n} × ${msg}`);
  }
}
console.log(`${errors} fel.`);
process.exit(errors > 0 ? 1 : 0);
