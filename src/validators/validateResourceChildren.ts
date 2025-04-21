import { ValidatorFn } from "../Editor";

export const validateResourceChildren: ValidatorFn = (blocks) => {
  const allowedChildTypes = ['numberedListItem', 'bulletListItem'];
  const relevantTypes = ['resource', 'additionalResources'];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    if (relevantTypes.includes(block.type)) {
      const children = block.children || [];

      const invalidChildren = children.filter(
        (child: any) => !allowedChildTypes.includes(child.type)
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
      resourceChildren:
        "Only 'numberedListItem' or 'bulletListItem' are allowed as children in resource blocks. \n" +
        errors.join('\n'),
    };
  }

  return {};
};
