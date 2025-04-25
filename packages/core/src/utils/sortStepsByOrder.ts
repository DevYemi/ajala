import { TSteps } from "../library/types";

export default function sortStepsByOrder(steps: Array<TSteps>) {
  // Create a map of ordered items for quick lookup
  const ordered_items = new Map();
  const unordered_items = [];
  const out_of_range_items = [];

  // Separate ordered, unordered and outofRange items
  for (const item of steps) {
    if (item?.order === undefined) {
      unordered_items.push(item);
    } else if (item?.order > steps.length || item?.order < 0) {
      out_of_range_items.push(item);
    } else {
      ordered_items.set(item.order, item);
    }
  }

  // Find the maximum order to determine array size
  const result = new Array(steps.length);

  let unorderedIndex = 0;
  let out_of_range_index = 0;

  // Build the result array
  for (let i = 0; i < steps.length; i++) {
    if (ordered_items.has(i)) {
      result[i] = ordered_items.get(i);
    } else if (unorderedIndex < unordered_items.length) {
      result[i] = unordered_items[unorderedIndex++];
    } else {
      result[i] = out_of_range_items[out_of_range_index++];
    }
  }

  // Trim the array if we over-allocated (only happens if maxOrder > original length)
  return result.length === steps.length
    ? result
    : result.slice(0, steps.length);
}
