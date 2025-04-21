import { ValidatorFn } from "../Editor";

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const validateDuplicates: ValidatorFn = (blocks) => {
  const validOrder = [
    'metadata',
    'objectives',
    'introduction',
    'step',
    'resource',
    'additionalTasks',
    'additionalResources',
  ];
  const allowedMultiple = ['step'];

  const typeCount: Record<string, number> = {};

  for (const block of blocks) {
    if (validOrder.includes(block.type)) {
      typeCount[block.type] = (typeCount[block.type] || 0) + 1;
    }
  }

  const duplicates = Object.entries(typeCount).filter(
    ([type, count]) => count > 1 && !allowedMultiple.includes(type)
  );

  if (duplicates.length > 0) {
    return {
      duplicates: `The following blocks appear more than once: ${duplicates
        .map(([type]) => capitalizeFirst(type))
        .join(', ')}`,
    };
  }

  return {};
};
