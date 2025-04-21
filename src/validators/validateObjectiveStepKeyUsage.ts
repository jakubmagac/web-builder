import { ValidatorFn } from "../Editor";

export const validateObjectiveStepKeyUsage: ValidatorFn = (blocks) => {
  const objectiveKeys = new Set<string>();
  const duplicateKeys: string[] = [];

  const stepKeysUsed = new Set<string>();
  const stepKeysExtra: string[] = [];

  const objectiveKeyCounts: Record<string, number> = {};

  // Collect keys from objective blocks
  for (const block of blocks) {
    if (block.type === 'objectives' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child.type === 'objective' && typeof child.props?.key === 'string') {
          const key = child.props.key;

          objectiveKeyCounts[key] = (objectiveKeyCounts[key] || 0) + 1;
          if (objectiveKeyCounts[key] > 1 && !duplicateKeys.includes(key)) {
            duplicateKeys.push(key);
          }

          objectiveKeys.add(key);
        }
      }
    }
  }

  // Collect and check step keys
  for (const block of blocks) {
    if (block.type === 'step' && typeof block.props?.key === 'string') {
      const keys = block.props.key.trim().split(/\s+/);
      for (const key of keys) {
        stepKeysUsed.add(key);
        if (!objectiveKeys.has(key)) {
          stepKeysExtra.push(key);
        }
      }
    }
  }

  // Check for unused objective keys
  const missingKeys: string[] = [];
  for (const key of objectiveKeys) {
    if (!stepKeysUsed.has(key)) {
      missingKeys.push(key);
    }
  }

  // Collect all errors
  const errors: string[] = [];

  if (duplicateKeys.length > 0) {
    errors.push(
      `Duplicate objective keys found: ${duplicateKeys.join(', ')}.`
    );
  }

  if (stepKeysExtra.length > 0) {
    errors.push(
      `Step blocks are using undefined keys: ${[...new Set(stepKeysExtra)].join(', ')}.`
    );
  }

  if (missingKeys.length > 0) {
    errors.push(
      `The following objective keys are defined but never used in any step: ${missingKeys.join(', ')}`
    );
  }

  return errors.length > 0 ? { objectiveStepKeys: errors.join('\n') } : {};
};
