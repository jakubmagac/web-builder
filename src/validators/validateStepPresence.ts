import { ValidatorFn } from "../Editor";

export const validateStepPresence: ValidatorFn = (blocks) => {
  const hasStep = blocks.some(block => block.type === 'step');

  return hasStep
    ? {}
    : { noStepError: "Document must contain at least one 'Step' block." };
};