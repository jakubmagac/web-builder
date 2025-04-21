import { ValidatorFn } from "../Editor";

export const validateObjectivePresence: ValidatorFn = (blocks) => {
  const hasObjective = blocks.some(block => block.type === 'objectives');

  return hasObjective
    ? {}
    : { noObjectiveError: "Document doesn't contain Objective block" };
};