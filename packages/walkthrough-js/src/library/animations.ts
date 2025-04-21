import { linearInterpolate } from "@/utils/chunks";
import Walkthrough from "./base";
import Placement from "./placement";
import { TTravelDistanceData } from "./types";
import UI from "./ui";

class Animations {
  walkthrough: Walkthrough;
  ui: UI;
  placement: Placement;

  constructor({
    walkthrough,
    ui,
    placement,
  }: {
    walkthrough: Walkthrough;
    ui: UI;
    placement: Placement;
  }) {
    this.walkthrough = walkthrough;
    this.ui = ui;
    this.placement = placement;
  }

  animate({
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

  scrollToLocation(target: HTMLElement) {
    return new Promise((resolve) => {
      const target_rect = target.getBoundingClientRect();

      // Makse sure we scroll to the target being at the center of the viewport
      const scroll_offset = window.innerHeight / 2 - target_rect.height / 2;
      let scroll_delta = window.scrollY + target_rect.y - scroll_offset;

      // Clamp scroll Value
      const max_scroll_height =
        document.documentElement.scrollHeight - window.innerHeight;
      scroll_delta = Math.min(Math.max(0, scroll_delta), max_scroll_height);

      this.animate({
        from: window.scrollY,
        to: scroll_delta,
        duration: 1000,
        onUpdate(scroll_time) {
          window.scrollTo(0, scroll_time);
        },
        onComplete() {
          resolve(null);
        },
      });
    });
  }

  spotlightTarget(index: number) {
    const { x, y, width, height, border_radius } =
      this.placement.overlay_cutout_svg_rect.calculatePlacmentDelta({
        active_index: index,
      });

    this.animate({
      from: 0,
      to: 1,
      duration: 500,
      onUpdate: (time) => {
        this.ui.overlay_cutout_el.setAttribute("width", `${width * time}`);
        this.ui.overlay_cutout_el.setAttribute("height", `${height * time}`);
      },
      onPlay: () => {
        this.ui.overlay_cutout_el.setAttribute("x", `${x}`);
        this.ui.overlay_cutout_el.setAttribute("y", `${y}`);
        this.ui.overlay_cutout_el.setAttribute("y", `${y}`);
        this.ui.overlay_cutout_el.setAttribute("rx", `${border_radius}`);
        this.ui.overlay_cutout_el.setAttribute("ry", `${border_radius}`);
      },
    });
  }

  travelToLocation(
    distance_option: TTravelDistanceData,
    {
      onComplete,
      onPlay,
    }: {
      onComplete?: () => void;
      onPlay?: () => void;
    } = {},
  ) {
    const outer_this = this;
    const tooltip_container_el = this.ui.tooltip_container_element;
    if (distance_option.is_valid) {
      const {
        x_delta,
        x_offset,
        y_delta,
        y_offset,
        tooltip_rect,
        active_index,
        placement,
      } = distance_option!;

      this.animate({
        from: 0,
        to: 1,
        duration: 1000,
        onUpdate(time) {
          const x_position = tooltip_rect?.x ?? 0;
          const y_position = tooltip_rect?.y ?? 0;
          const x_smoothen = x_position + (x_delta + x_offset) * time;
          const y_smoothen = y_position + (y_delta + y_offset) * time;

          tooltip_container_el.style.transform = `translate(${x_smoothen}px, ${y_smoothen}px)`;
        },
        onComplete: () => {
          const { x, y, rotate } =
            outer_this.placement.arrow.calculatePlacmentDelta({
              active_index,
              placement,
            });
          outer_this.ui.arrow_element.style.visibility = "visible";
          outer_this.ui.arrow_element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

          outer_this.walkthrough.executed_steps.add(
            this.walkthrough.flatten_steps[
              distance_option.active_index as number
            ],
          );

          if (onComplete) {
            onComplete();
          }
        },
        onPlay: () => {
          this.spotlightTarget(active_index);
          if (onPlay) {
            onPlay();
          }
        },
      });
    }
  }
}

export default Animations;
