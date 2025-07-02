import { TSteps } from "../library/types";

export default function sortStepsByOrder(steps: TSteps[]) {
  const ordered_map = new Map<number, TSteps[]>();
  const unordered_items: TSteps[] = [];
  const out_of_range_items: TSteps[] = [];

  // Phase 1: Categorize steps
  for (const step of steps) {
    const order = step?.order;

    if (order === undefined) {
      unordered_items.push(step);
    } else if (order < 0 || order >= steps.length) {
      out_of_range_items.push(step);
    } else {
      if (!ordered_map.has(order)) {
        ordered_map.set(order, []);
      }
      ordered_map.get(order)!.push(step);
    }
  }

  // Phase 2: Build the sorted result
  const result: TSteps[] = [];
  let unordered_index = 0;
  let out_of_range_index = 0;

  for (let i = 0; result.length < steps.length; i++) {
    const ordered_at_i = ordered_map.get(i);

    if (ordered_at_i) {
      result.push(...ordered_at_i);
    } else if (unordered_index < unordered_items.length) {
      result.push(unordered_items[unordered_index++]);
    } else if (out_of_range_index < out_of_range_items.length) {
      result.push(out_of_range_items[out_of_range_index++]);
    }
  }

  return result;
}
