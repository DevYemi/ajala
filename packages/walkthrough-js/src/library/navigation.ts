import { animate } from "@/utils/chunks";
import Walkthrough from "./base";
import Placement from "./placement";
import { TTravelDistanceData } from "./types";
import UI from "./ui";

class Navigation {
  walkthrough: Walkthrough;
  #ui: UI;
  #placement: Placement;

  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.walkthrough = walkthrough;
    this.#ui = ui;
    this.#placement = new Placement({ walkthrough, ui });

    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  init() {}

  async onNext() {
    const next_index = this.walkthrough.active_step_index + 1;

    if (this.walkthrough.flatten_steps.length > next_index) {
      const distance_option = await this.calculateTravelDistance(next_index);
      const onComplete = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = next_index;
      };
      this.travelToLocation(distance_option, { onComplete: onComplete });
    } else {
      this.onClose();
    }
  }

  async onPrev() {
    const prev_index = this.walkthrough.active_step_index - 1;

    if (prev_index > -1) {
      const distance_option = await this.calculateTravelDistance(prev_index);
      const onPlay = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = prev_index;
      };
      this.travelToLocation(distance_option, { onPlay: onPlay });
    }
  }

  onClose() {
    console.log("onClose", this);
  }

  private async calculateTravelDistance(
    next_index: number,
  ): Promise<TTravelDistanceData> {
    let scrolled = false;
    this.#ui.arrow_element.style.visibility = "hidden";

    const next_step_target = this.#ui.getTargetElement(
      this.walkthrough.flatten_steps[next_index].target,
    );

    if (!next_step_target)
      return {
        is_valid: false,
        scrolled: scrolled,
        y_delta: 0,
        x_delta: 0,
        y_offset: 0,
        x_offset: 0,
        active_index: 0,
        tooltip_rect: null,
        target_rect: null,
        placement: "auto",
      };

    next_step_target.style.border = "5px solid green";
    const tooltip_container_el = this.#ui.tooltip_container_element;
    let target_rect = next_step_target.getBoundingClientRect();
    let tooltip_rect = tooltip_container_el.getBoundingClientRect();

    const gutter =
      this.walkthrough.flatten_steps[next_index].tooltip_gutter ??
      this.walkthrough.options.tooltip_gutter ??
      0;

    const getDimensionOffset = (value: number) => {
      return value > 0 ? -value : Math.abs(value);
    };

    let y_offset = getDimensionOffset(tooltip_rect.y);
    let x_offset = getDimensionOffset(tooltip_rect.x);

    let y_delta = target_rect.y + gutter;
    let x_delta = target_rect.x + gutter;

    /**
     * Prevent card_element from moving outside screen viewport height.
     * Scroll page to target if target is outside screen viewport height.
     */

    if (
      target_rect.y < 0 ||
      target_rect.y > window.innerHeight ||
      target_rect.y + target_rect.height > window.innerHeight ||
      y_delta < 0 ||
      y_delta > window.innerHeight ||
      y_delta + tooltip_rect.height > window.innerHeight ||
      y_delta + tooltip_rect.height < 0
    ) {
      await this.#scrollToLocation(next_step_target);
      scrolled = true;

      target_rect = next_step_target.getBoundingClientRect();
      tooltip_rect = tooltip_container_el.getBoundingClientRect();

      y_offset = getDimensionOffset(tooltip_rect.y);
      x_offset = getDimensionOffset(tooltip_rect.x);
    }

    /**
     * Calculate the tooltip placement
     */
    const placement_delta = this.#placement.calTooltipPlacementDelta({
      target: next_step_target,
      next_index,
    });
    x_delta = placement_delta.x_delta;
    y_delta = placement_delta.y_delta;

    return {
      y_delta,
      x_delta,
      y_offset,
      x_offset,
      tooltip_rect,
      target_rect,
      active_index: next_index,
      is_valid: true,
      scrolled: scrolled,
      placement: placement_delta.placement,
    };
  }

  #scrollToLocation(target: HTMLElement) {
    return new Promise((resolve) => {
      const target_rect = target.getBoundingClientRect();

      // Makse sure we scroll to the target being at the center of the viewport
      const scroll_offset = window.innerHeight / 2 - target_rect.height / 2;
      let scroll_delta = window.scrollY + target_rect.y - scroll_offset;

      // Clamp scroll Value
      const max_scroll_height =
        document.documentElement.scrollHeight - window.innerHeight;
      scroll_delta = Math.min(Math.max(0, scroll_delta), max_scroll_height);

      animate({
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
    const tooltip_container_el = this.#ui.tooltip_container_element;
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

      animate({
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
            outer_this.#placement.calculateArrowPlacmentDelta({
              active_index,
              placement,
            });
          outer_this.#ui.arrow_element.style.visibility = "visible";
          outer_this.#ui.arrow_element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

          outer_this.walkthrough.executed_steps.add(
            this.walkthrough.flatten_steps[
              distance_option.active_index as number
            ],
          );

          if (onComplete) {
            onComplete();
          }
        },
        onPlay: onPlay,
      });
    }
  }

  async run() {
    // document.body.style.overflow = "hidden";
    const distance_option = await this.calculateTravelDistance(0);
    this.travelToLocation(distance_option);
  }

  cleanUp() {}
}

export default Navigation;
