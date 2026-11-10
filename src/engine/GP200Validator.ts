import { BLOCK_ORDER } from '../types';
import type {
  BlockId,
  BlockSetting,
  BlockSettings,
  GP200Manual,
  GP200ModelList,
  ManualModel,
  ParamDefinition,
  ValidationIssue,
} from '../types';

/** Antaget intervall för vridreglage när manualen inte anger något. */
const DEFAULT_KNOB = { min: 0, max: 100 };
const TIME_PARAMS = /^(Time|Time A|Time B|Pre Delay)$/;

/**
 * Garanterar att inget preset innehåller modeller som inte finns i användarens
 * GP-200 (gp200-models.json) och att parametrarna finns för modellen enligt
 * manualen (gp200-manual.json).
 */
export class GP200Validator {
  constructor(
    private readonly models: GP200ModelList,
    private readonly manual: GP200Manual,
  ) {}

  modelExists(block: BlockId, model: string): boolean {
    return this.models.blocks[block]?.includes(model) ?? false;
  }

  manualEntry(block: BlockId, model?: string): ManualModel | undefined {
    return model ? this.manual.blocks[block]?.[model] : undefined;
  }

  paramDefinitions(block: BlockId, model?: string): ParamDefinition[] {
    return this.manualEntry(block, model)?.params ?? [];
  }

  /** Parametrar för en modell med fullständigt intervall (antaget om okänt). */
  paramRange(def: ParamDefinition): { min: number; max: number; confirmed: boolean } {
    if (def.min !== undefined && def.max !== undefined) {
      return { min: def.min, max: def.max, confirmed: !!def.rangeConfirmed };
    }
    if (TIME_PARAMS.test(def.name)) return { min: 0, max: 4000, confirmed: false };
    return { ...DEFAULT_KNOB, confirmed: false };
  }

  validateBlock(block: BlockId, setting: BlockSetting): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    if (setting.enabled && !setting.model) {
      issues.push({ level: 'error', block, message: `${block} är ON men saknar modell.` });
    }
    if (!setting.model) return issues;

    if (!this.modelExists(block, setting.model)) {
      issues.push({
        level: 'error',
        block,
        message: `Modellen "${setting.model}" finns inte i ${block}-listan för din GP-200.`,
      });
      return issues;
    }

    const entry = this.manualEntry(block, setting.model);
    const strict = !!entry && !entry.missingInManual && !entry.paramsInferred;
    if (!entry || entry.missingInManual) {
      issues.push({
        level: 'warning',
        block,
        message: `"${setting.model}" beskrivs inte i manualen v1.8.0 – parameternamnen kan inte bekräftas.`,
      });
    }

    const defs = entry?.params ?? [];
    for (const [name, value] of Object.entries(setting.params ?? {})) {
      const def = defs.find((d) => d.name === name);
      if (!def) {
        issues.push({
          level: strict ? 'error' : 'warning',
          block,
          message: `${setting.model} har ingen parameter "${name}" enligt manualen.`,
        });
        continue;
      }
      if (def.kind === 'switch') {
        if (value !== 'ON' && value !== 'OFF') {
          issues.push({ level: 'error', block, message: `${block} ${name} måste vara ON eller OFF.` });
        }
        continue;
      }
      if (def.kind === 'select' || typeof value !== 'number') continue;
      const range = this.paramRange(def);
      if (value < range.min || value > range.max) {
        issues.push({
          level: range.confirmed ? 'error' : 'warning',
          block,
          message: `${block} ${name} = ${value} ligger utanför ${range.min}…${range.max}.`,
        });
      }
    }
    return issues;
  }

  validate(blocks: BlockSettings): ValidationIssue[] {
    return BLOCK_ORDER.flatMap((block) => {
      const setting = blocks[block];
      return setting ? this.validateBlock(block, setting) : [];
    });
  }
}
