import { ValidatorFn } from "../Editor";

export const validateObjectivesChildren: ValidatorFn = (blocks) => {
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    if (block.type === 'objectives') {
      const children = block.children || [];

      const invalidChildren = children.filter(
        (child: any) => child.type !== 'objective'
      );

      if (invalidChildren.length > 0) {
        errors.push(
          `Objectives contains invalid children: ${invalidChildren
            .map(child => child.type)
            .join(', ')}`
        );
      }
    }
  });

  if (errors.length > 0) {
    return {
      objectivesChildren:
        "Only 'Objective' blocks are allowed as children in the objectives block.\n" +
        errors.join('\n'),
    };
  }

  return {};
};
