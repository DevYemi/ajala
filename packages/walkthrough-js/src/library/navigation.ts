import Walkthrough from "./base";
import Placement from "./placement";
import {
  TPlacementAlign,
  TPlacementAxis,
  TTooltipPlacement,
  TTravelDistanceData,
} from "./types";
import UI from "./ui";
import { animate } from "popmotion";

class Navigation {
  walkthrough: Walkthrough;
  #ui: UI;
  #placement: Placement;
  loc: {
    placement: TTooltipPlacement;
    axis: TPlacementAxis | undefined;
    align: TPlacementAlign | undefined;
  };
  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.walkthrough = walkthrough;
    this.#ui = ui;
    this.#placement = new Placement({ walkthrough, ui });

    const placement_loc =
      this.walkthrough.active_step?.tooltip_placement ||
      this.walkthrough.options.tooltip_placement ||
      "auto";
    const loc = placement_loc.split("_");
    this.loc = {
      placement: placement_loc,
      axis: loc[0] as TPlacementAxis,
      align: loc[1] as TPlacementAlign,
    };

    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  init() {}

  async onNext() {
    const next_index = this.walkthrough.active_step_index + 1;

    if (this.walkthrough.flatten_steps.length > next_index) {
      const distance_option = await this.calculateTravelDistance(next_index);
      const onPlay = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = next_index;
      };
      this.travelToLocation(distance_option, { onPlay: onPlay });
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

  private async calculateTravelDistance(next_index: number) {
    let scrolled = false;
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
        card_rect: null,
        target_rect: null,
      };

    const tooltip_container_el = this.#ui.tooltip_container_element;
    let target_rect = next_step_target.getBoundingClientRect();
    let card_rect = tooltip_container_el.getBoundingClientRect();

    const gutter =
      this.walkthrough.active_step?.gutter ??
      this.walkthrough.options.gutter ??
      0;

    const getDimensionOffset = (value: number) => {
      return value > 0 ? -value : Math.abs(value);
    };

    let y_offset = getDimensionOffset(card_rect.y);
    let x_offset = getDimensionOffset(card_rect.x);

    let y_delta = target_rect.y + gutter;
    let x_delta = target_rect.x + gutter;

    /**
     * Prevent card_element from moving outside screen viewport height.
     * Scroll page to target if target is outside screen viewport height.
     */

    if (
      target_rect.y < 0 ||
      target_rect.y > window.innerHeight ||
      y_delta < 0 ||
      y_delta > window.innerHeight ||
      y_delta + card_rect.height > window.innerHeight ||
      y_delta + card_rect.height < 0
    ) {
      await this.#scrollToLocation(next_step_target);
      scrolled = true;

      target_rect = next_step_target.getBoundingClientRect();
      card_rect = tooltip_container_el.getBoundingClientRect();

      y_offset = getDimensionOffset(card_rect.y);
      x_offset = getDimensionOffset(card_rect.x);
    }

    /**
     * Calculate the tooltip placement
     */
    const axis_delta = this.#placement.calculateAxis({
      axis: this.loc.axis,
      target: next_step_target,
    });
    const y_alignment_delta = this.#placement.calculateYAlignment({
      align: this.loc.align,
      target: next_step_target,
    });
    const x_alignment_delta = this.#placement.calculateXAlignment({
      align: this.loc.align,
      target: next_step_target,
    });

    if (this.loc.axis === "top" || this.loc.axis === "bottom") {
      if (x_alignment_delta.is_valid && axis_delta.is_valid) {
        x_delta = x_alignment_delta.alignment;
        y_delta = axis_delta.axis;
      } else {
        const { auto_x_delta, auto_y_delta } = this.#placement.calculateAuto({
          target: next_step_target,
        });
        x_delta = auto_x_delta;
        y_delta = auto_y_delta;
      }
    } else if (this.loc.axis === "left" || this.loc.axis === "right") {
      if (y_alignment_delta.is_valid && axis_delta.is_valid) {
        x_delta = axis_delta.axis;
        y_delta = y_alignment_delta.alignment;
      } else {
        const { auto_x_delta, auto_y_delta } = this.#placement.calculateAuto({
          target: next_step_target,
        });
        x_delta = auto_x_delta;
        y_delta = auto_y_delta;
      }
    } else {
      const { auto_x_delta, auto_y_delta } = this.#placement.calculateAuto({
        target: next_step_target,
      });
      x_delta = auto_x_delta;
      y_delta = auto_y_delta;
    }

    return {
      y_delta,
      x_delta,
      y_offset,
      x_offset,
      card_rect,
      target_rect,
      active_index: next_index,
      is_valid: true,
      scrolled: scrolled,
    };
  }

  #scrollToLocation(target: HTMLElement) {
    return new Promise((resolve) => {
      const target_rect = target.getBoundingClientRect();
      const scroll_offset = 40;
      const scroll_delta = window.scrollY + target_rect.y - scroll_offset;

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
    const tooltip_container_el = this.#ui.tooltip_container_element;
    if (distance_option.is_valid) {
      const { x_delta, x_offset, y_delta, y_offset, card_rect } =
        distance_option!;
      const walkthrough = this.walkthrough;

      animate({
        from: 0,
        to: 1,
        duration: 1000,
        onUpdate(time) {
          const x_position = card_rect?.x ?? 0;
          const y_position = card_rect?.y ?? 0;
          const x_smoothen = x_position + (x_delta + x_offset) * time;
          const y_smoothen = y_position + (y_delta + y_offset) * time;

          tooltip_container_el.style.transform = `translate(${x_smoothen}px, ${y_smoothen}px)`;
        },
        onComplete: () => {
          walkthrough.executed_steps.add(
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
