import { ValidatorFn } from "../Editor";

export const validateNoSelfNestedBlocks: ValidatorFn = (blocks) => {
  const targetTypes = new Set([
    "comment",
    "example",
    "lecturer",
    "solution",
    "task",
    "warning",
    "wrongExample",
  ]);

  const errors: string[] = [];

  blocks.forEach((block, index) => {
    if (targetTypes.has(block.type) && Array.isArray(block.children)) {
      const invalidChildren = block.children.filter(
        (child: any) => child.type === block.type
      );

      if (invalidChildren.length > 0) {
        errors.push(
          `Block of type "${block.type}" contains children of the same type.`
        );
      }
    }
  });

  return errors.length > 0
    ? { noSelfNesting: errors.join('\n') }
    : {};
};
