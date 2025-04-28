import { linearInterpolate } from "../utils/chunks";
import { AjalaJourney } from "./main";
import Placement from "./placement";
import { TTransitionType, TTravelDistanceData } from "./types";
import UI from "./ui";

type TTransitionFunc = (
  distance_option: TTravelDistanceData,
  callbacks?: Partial<{ onComplete: () => void; onPlay: () => void }>,
) => void;
class Animations {
  ajala: AjalaJourney;
  ui: UI;
  placement: Placement;
  transition_type: TTransitionType;
  is_animating: boolean = false;
  transition: Record<TTransitionType, TTransitionFunc>;

  constructor({
    ajala,
    ui,
    placement,
  }: {
    ajala: AjalaJourney;
    ui: UI;
    placement: Placement;
  }) {
    this.ajala = ajala;
    this.ui = ui;
    this.placement = placement;
    this.transition_type = this.ajala.options?.transition_type || "traveller";
    this.transition = {
      traveller: this.travelTransition.bind(this),
      popout: this.popOutTransition.bind(this),
    };
  }

  init() {
    this.transition_type = this.ajala.options?.transition_type || "traveller";
    this.transition = {
      traveller: this.travelTransition.bind(this),
      popout: this.popOutTransition.bind(this),
    };
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
        this.is_animating = true;
      } else {
        onComplete();
        this.is_animating = false;
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

  #getTransitionDuration(active_index: number) {
    return (
      this.ajala.flatten_steps[active_index]?.transition_duration ??
      this.ajala.options?.transition_duration ??
      1000
    );
  }

  scrollToLocation(target: HTMLElement, active_index: number) {
    return new Promise((resolve) => {
      const target_rect = target.getBoundingClientRect();

      // Makse sure we scroll to the target being at the center of the viewport
      const scroll_offset = window.innerHeight / 2 - target_rect.height / 2;
      let scroll_delta = window.scrollY + target_rect.y - scroll_offset;

      // Clamp scroll Value
      const max_scroll_height =
        document.documentElement.scrollHeight - window.innerHeight;
      scroll_delta = Math.min(Math.max(0, scroll_delta), max_scroll_height);

      const scroll_duration =
        this.ajala.flatten_steps[active_index]?.scroll_duration ??
        this.ajala.options?.scroll_duration ??
        1000;

      this.animate({
        from: window.scrollY,
        to: scroll_delta,
        duration: scroll_duration,
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
        this.ui.updateOverlayCutoutPathData({
          x,
          y,
          width: width * time,
          height: height * time,
          border_radius,
        });
      },
      onPlay: () => {
        this.ui.updateOverlayCutoutPathData({
          x,
          y,
          width: 0,
          height: 0,
          border_radius,
        });
      },
    });
  }

  travelTransition(
    distance_option: TTravelDistanceData,
    {
      onComplete,
      onPlay,
    }: {
      onComplete?: () => void;
      onPlay?: () => void;
    } = {},
  ) {
    const tooltip_container_el = this.ui.tooltip_container_element;
    if (distance_option.is_valid) {
      const {
        x_delta,
        x_offset,
        y_delta,
        y_offset,
        tooltip_rect,
        active_index,
      } = distance_option!;

      this.animate({
        from: 0,
        to: 1,
        duration: this.#getTransitionDuration(active_index),
        onUpdate(time) {
          const x_position = tooltip_rect?.x ?? 0;
          const y_position = tooltip_rect?.y ?? 0;
          const x_smoothen = x_position + (x_delta + x_offset) * time;
          const y_smoothen = y_position + (y_delta + y_offset) * time;

          tooltip_container_el.style.transform = `translate(${x_smoothen}px, ${y_smoothen}px)`;
        },
        onComplete: () => {
          if (onComplete) {
            onComplete();
          }
        },
        onPlay: () => {
          this.ui.tooltip_container_element.style.visibility = "visible";
          this.spotlightTarget(active_index);
          if (onPlay) {
            onPlay();
          }
        },
      });
    }
  }
  popOutTransition(
    distance_option: TTravelDistanceData,
    {
      onComplete,
      onPlay,
    }: {
      onComplete?: () => void;
      onPlay?: () => void;
    } = {},
  ) {
    const tooltip_container_el = this.ui.tooltip_container_element;
    if (distance_option.is_valid) {
      const { x_delta, y_delta, active_index } = distance_option!;

      this.animate({
        from: 0,
        to: 1,
        duration: this.#getTransitionDuration(active_index),
        onUpdate(time) {
          tooltip_container_el.style.visibility = "visible";
          tooltip_container_el.style.transform = `translate(${x_delta}px, ${y_delta}px) scale(${time})`;
        },
        onComplete: () => {
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
