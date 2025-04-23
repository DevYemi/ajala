import { TWalkthroughSteps } from "../library/types";

export const linearInterpolate = (a: number, b: number, t: number) => {
  t = Math.max(0, Math.min(1, t));
  return a + (b - a) * t;
};

// Create a debounce function
export function createDebounceFunc(cb: Function, delay: number) {
  let timeoutRef: any = null;

  return function (...args: any[]) {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    timeoutRef = setTimeout(() => {
      cb(...args);
      clearTimeout(timeoutRef!);
      timeoutRef = null;
    }, delay);
  };
}

export function checkForStepsIdValidity(steps: Array<TWalkthroughSteps>) {
  const store = new Set<string>();
  const new_steps = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const new_id = `step-${i + Math.random()}`;
    if (step.id) {
      if (store.has(step.id)) {
        console.warn(
          `Duplicate walkthrough step id found: ${step.id}. Please make sure all step ids are unique.`,
        );
        step.id = new_id;
      } else {
        store.add(step.id);
      }
    } else {
      step.id = new_id;
      console.warn(
        `Walkthrough step ${i} is missing an id. Please make sure all steps have unique ids.`,
      );
    }
    new_steps.push(step);
  }

  return new_steps;
}
