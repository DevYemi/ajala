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
