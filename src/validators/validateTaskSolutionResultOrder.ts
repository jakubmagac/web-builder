import { ValidatorFn } from "../Editor";

type Block = {
  type: string;
  children?: Block[];
};

export const validateTaskSolutionResultOrder: ValidatorFn = (blocks) => {
  const errors: string[] = [];

  const walk = (blockList: Block[], path: string = 'root') => {
    for (let i = 0; i < blockList.length; i++) {
      const block = blockList[i];
      const prev = blockList[i - 1];

      if (block.type === 'solution') {
        if (!prev || prev.type !== 'task') {
          errors.push(`"Solution" block must be immediately after a "Task" block.`);
        }
      }

      if (block.type === 'result') {
        if (!prev || (prev.type !== 'task' && prev.type !== 'solution')) {
          errors.push(`"Result" block must be immediately after a "Task" or "Solution" block.`);
        }
      }

      if ((block.type === 'solution' || block.type === 'result')) {
        const hasTaskBefore = blockList.slice(0, i).some(b => b.type === 'task');
        if (!hasTaskBefore) {
          errors.push(`"${block.type}" has no preceding "Task" block.`);
        }
      }

      if (Array.isArray(block.children)) {
        walk(block.children, `${path}.${block.type}`);
      }
    }
  };

  walk(blocks);

  return errors.length > 0
    ? { taskSolutionResultOrder: errors.join('\n') }
    : {};
};
