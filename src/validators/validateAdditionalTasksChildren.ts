import { ValidatorFn } from "../Editor";

export const validateAdditionalTasksChildren: ValidatorFn = (blocks) => {
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    if (block.type === 'additionalTasks') {
      const children = block.children || [];

      const invalidChildren = children.filter(
        (child: any) => child.type !== 'task'
      );

      if (invalidChildren.length > 0) {
        errors.push(
          `(${block.type}) contains invalid children: ${invalidChildren
            .map(child => child.type)
            .join(', ')}`
        );
      }
    }
  });

  if (errors.length > 0) {
    return {
      additionalTasksChildren:
        "Only 'Task' blocks are allowed as children in Additional Tasks block.\n" +
        errors.join('\n'),
    };
  }

  return {};
};
