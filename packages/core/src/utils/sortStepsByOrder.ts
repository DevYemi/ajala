import { TSteps } from "../library/types";

export default function sortStepsByOrder(steps: Array<TSteps>) {
  return steps.sort((a, b) => {
    if (!a?.order && !b?.order) return 0;
    if (!a?.order) return 1;
    if (!b.order) return -1;
    return a.order - b.order;
  });
}
