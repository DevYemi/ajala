export const linearInterpolate = (a: number, b: number, t: number) => {
  t = Math.max(0, Math.min(1, t));
  return a + (b - a) * t;
};

export function animate({
  from = 0,
  to = 1,
  duration = 1000,
  onPlay = () => {},
  onUpdate = () => {},
  onComplete = () => {},
}: Partial<{
  from: number;
  to: number;
  duration: number;
  onPlay: () => void;
  onUpdate: (value: number) => void;
  onComplete: () => void;
}>) {
  const startTime = performance.now();
  let isActive = true;
  let animationFrameId: any;

  // Easing functions library
  const easings = {
    easeInOut: (t: number) =>
      t < 0.5
        ? 2 * t * t // First half: accelerate
        : 1 - Math.pow(-2 * t + 2, 2) / 2, // Second half: decelerate
  };

  // Validate easing function
  const easeFn = easings["easeInOut"];

  onPlay();

  const tick = (currentTime: number) => {
    if (!isActive) return;

    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easeFn(rawProgress);
    const value = linearInterpolate(from, to, easedProgress);

    onUpdate(value);

    if (rawProgress < 1) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      onComplete();
    }
  };

  animationFrameId = requestAnimationFrame(tick);

  return {
    stop: () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    },
  };
}
