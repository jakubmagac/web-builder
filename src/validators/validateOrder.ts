import { ValidatorFn } from "../Editor";

export const validateOrder: ValidatorFn = (blocks) => {
  const validOrder = [
    'metadata',
    'objectives',
    'introduction',
    'step',
    'resource',
    'additionalTasks',
    'additionalResources',
  ];

  const filtered = blocks
    .map(block => block.type)
    .filter(type => validOrder.includes(type));

  const isInCorrectOrder = filtered.every((type, i, arr) => {
    const currentIndex = validOrder.indexOf(type);
    const prevIndex = i === 0 ? -1 : validOrder.indexOf(arr[i - 1]);
    return currentIndex >= prevIndex;
  });

  if (!isInCorrectOrder) {
    return {
      order:
        "Blocks are not in the correct order. Correct order should be Metadata, Objectives, Introduction, Step, Resources, Additional Tasks, Additional Resources.",
    };
  }

  return {};
};
