import {
  TPlacementAlign,
  TPlacementAxis,
  TTooltipPlacement,
  TTravelDistanceData,
} from "../types";
import UI from "../ui";
import Walkthrough from "../base";
import Placement from ".";
import Animations from "../animations";

class TooltipPlacement {
  walkthrough: Walkthrough;
  placement: Placement;
  ui: UI;
  animations: Animations;
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
    this.animations = new Animations({ walkthrough, ui, placement });
  }

  async calculateTravelDistance(
    next_index: number,
  ): Promise<TTravelDistanceData> {
    let scrolled = false;
    this.ui.arrow_element.style.visibility = "hidden";

    const next_step_target = this.ui.getTargetElement(
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
        taregt_el: next_step_target,
        placement: "auto",
      };

    const tooltip_container_el = this.ui.tooltip_container_element;
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
      if (this.animations.transition_type === "popout") {
        this.ui.tooltip_container_element.style.visibility = "hidden";
      }

      await this.animations.scrollToLocation(next_step_target);
      console.log(window.scrollY);
      scrolled = true;

      target_rect = next_step_target.getBoundingClientRect();
      tooltip_rect = tooltip_container_el.getBoundingClientRect();

      y_offset = getDimensionOffset(tooltip_rect.y);
      x_offset = getDimensionOffset(tooltip_rect.x);
    }

    /**
     * Calculate the tooltip placement
     */
    const placement_delta = this.calculatePlacementDelta({
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
      taregt_el: next_step_target,
      active_index: next_index,
      is_valid: true,
      scrolled: scrolled,
      placement: placement_delta.placement,
    };
  }

  calculatePlacementDelta({
    target,
    next_index,
  }: {
    target: HTMLElement;
    next_index: number;
  }) {
    let x_delta = 0;
    let y_delta = 0;
    let placement: TTooltipPlacement = "auto";
    const {
      axis,
      align,
      axis_gutter,
      spotlight,
      placement: metadata_placement,
    } = this.placement.getMetadata({ next_index });

    const axis_delta = this.#calculateAxis({
      axis: axis,
      target: target,
      axis_gutter,
      spotlight_padding: spotlight.padding,
    });
    const y_alignment_delta = this.#calculateYAlignment({
      align: align,
      target: target,
    });
    const x_alignment_delta = this.#calculateXAlignment({
      align: align,
      target: target,
    });

    if (axis === "top" || axis === "bottom") {
      if (x_alignment_delta.is_valid && axis_delta.is_valid) {
        x_delta = x_alignment_delta.alignment;
        y_delta = axis_delta.axis;
        placement = metadata_placement;
      } else {
        const { auto_x_delta, auto_y_delta, auto_placement } =
          this.#calculateAuto({
            target: target,
            axis_gutter,
            spotlight_padding: spotlight.padding,
          });

        x_delta = auto_x_delta;
        y_delta = auto_y_delta;
        placement = auto_placement;
      }
    } else if (axis === "left" || axis === "right") {
      if (y_alignment_delta.is_valid && axis_delta.is_valid) {
        x_delta = axis_delta.axis;
        y_delta = y_alignment_delta.alignment;
        placement = metadata_placement;
      } else {
        const { auto_x_delta, auto_y_delta, auto_placement } =
          this.#calculateAuto({
            target: target,
            axis_gutter,
            spotlight_padding: spotlight.padding,
          });

        x_delta = auto_x_delta;
        y_delta = auto_y_delta;
        placement = auto_placement;
      }
    } else {
      const { auto_x_delta, auto_y_delta, auto_placement } =
        this.#calculateAuto({
          target: target,
          axis_gutter,
          spotlight_padding: spotlight.padding,
        });

      x_delta = auto_x_delta;
      y_delta = auto_y_delta;
      placement = auto_placement;
    }

    return {
      x_delta,
      y_delta,
      placement,
    };
  }

  #calculateAuto({
    target,
    axis_gutter,
    spotlight_padding,
  }: {
    target: HTMLElement;
    axis_gutter: number;
    spotlight_padding: number;
  }) {
    const all_placement: TTooltipPlacement[] = [
      "bottom_center",
      "bottom_right",
      "right_bottom",
      "right_center",
      "right_top",
      "top_right",
      "top_center",
      "top_left",
      "left_top",
      "left_center",
      "left_bottom",
      "bottom_left",
    ];

    let auto_x_delta = 0;
    let auto_y_delta = 0;
    let auto_placement: TTooltipPlacement = "bottom_center";

    for (let i = 0; i < all_placement.length; i++) {
      auto_placement = all_placement[i];
      const loc = auto_placement.split("_");
      const axis = loc[0] as TPlacementAxis;
      const align = loc[1] as TPlacementAlign;

      const axis_delta = this.#calculateAxis({
        axis: axis,
        target: target,
        axis_gutter,
        spotlight_padding: spotlight_padding,
      });
      const y_alignment_delta = this.#calculateYAlignment({
        align: align,
        target: target,
      });
      const x_alignment_delta = this.#calculateXAlignment({
        align: align,
        target: target,
      });

      if (
        (axis === "bottom" || axis === "top") &&
        axis_delta.is_valid &&
        x_alignment_delta.is_valid
      ) {
        auto_x_delta = x_alignment_delta.alignment;
        auto_y_delta = axis_delta.axis;
        break;
      }

      if (
        (axis === "right" || axis === "left") &&
        axis_delta.is_valid &&
        y_alignment_delta.is_valid
      ) {
        auto_x_delta = axis_delta.axis;
        auto_y_delta = y_alignment_delta.alignment;
        break;
      }

      if (i === all_placement.length - 1) {
        auto_y_delta = axis_delta.axis;
        auto_x_delta = x_alignment_delta.alignment;
      }
    }

    return {
      auto_x_delta,
      auto_y_delta,
      auto_placement,
    };
  }

  #calculateAxis({
    axis,
    target,
    axis_gutter,
    spotlight_padding,
  }: {
    axis?: TPlacementAxis;
    target: HTMLElement;
    axis_gutter: number;
    spotlight_padding: number;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect = this.ui.tooltip_container_element.getBoundingClientRect();
    const result = {
      is_valid: false,
      axis: 0,
    };

    if (axis === "top") {
      const top_position =
        target_rect.y - card_rect.height - axis_gutter - spotlight_padding;
      if (top_position >= 0 && target_rect.y <= window.innerHeight) {
        result.is_valid = true;
        result.axis = top_position;
      } else {
        result.is_valid = false;
        result.axis = top_position;
      }
    }

    if (axis === "bottom") {
      const bottom_position =
        target_rect.bottom + axis_gutter + spotlight_padding;
      if (
        bottom_position + card_rect.height >= 0 &&
        bottom_position + card_rect.height <= window.innerHeight
      ) {
        result.is_valid = true;
        result.axis = bottom_position;
      } else {
        result.is_valid = false;
        result.axis = bottom_position;
      }
    }

    if (axis === "left") {
      const left_position =
        target_rect.x - card_rect.width - axis_gutter - spotlight_padding;
      if (left_position >= 0 && target_rect.x <= window.innerWidth) {
        result.is_valid = true;
        result.axis = left_position;
      } else {
        result.is_valid = false;
        result.axis = left_position;
      }
    }
    if (axis === "right") {
      const right_position =
        target_rect.right + axis_gutter + spotlight_padding;
      if (
        right_position >= 0 &&
        right_position + card_rect.width <= window.innerWidth
      ) {
        result.is_valid = true;
        result.axis = right_position;
      } else {
        result.is_valid = false;
        result.axis = right_position;
      }
    }

    return result;
  }

  #calculateYAlignment({
    align,
    target,
  }: {
    align?: TPlacementAlign;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const tooltip_rect =
      this.ui.tooltip_container_element.getBoundingClientRect();
    const vertical = {
      is_valid: false,
      alignment: 0,
    };

    if (align === "top") {
      if (
        target_rect.y + tooltip_rect.height <= window.innerHeight &&
        target_rect.y >= 0
      ) {
        vertical.is_valid = true;
        vertical.alignment = target_rect.y;
      } else {
        vertical.is_valid = false;
        vertical.alignment = target_rect.y;
      }
    }

    if (align === "center") {
      const target_half = target_rect.height / 2;
      const tooltip_half = tooltip_rect.height / 2;
      const center_alignment = target_rect.y + target_half - tooltip_half;
      if (
        center_alignment + target_rect.height <= window.innerHeight &&
        center_alignment >= 0
      ) {
        vertical.is_valid = true;
        vertical.alignment = center_alignment;
      } else {
        vertical.is_valid = false;
        vertical.alignment = center_alignment;
      }
    }

    if (align === "bottom") {
      const bottom_alignment = target_rect.bottom - tooltip_rect.height;

      if (
        bottom_alignment + tooltip_rect.height <= window.innerHeight &&
        bottom_alignment >= 0
      ) {
        vertical.is_valid = true;
        vertical.alignment = bottom_alignment;
      } else {
        vertical.is_valid = false;
        vertical.alignment = bottom_alignment;
      }
    }

    return vertical;
  }

  #calculateXAlignment({
    align,
    target,
  }: {
    align?: TPlacementAlign;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect = this.ui.tooltip_container_element.getBoundingClientRect();
    const horizontal = {
      is_valid: false,
      alignment: 0,
    };

    if (align === "left") {
      if (
        target_rect.x + card_rect.width <= window.innerWidth &&
        target_rect.x >= 0
      ) {
        horizontal.is_valid = true;
        horizontal.alignment = target_rect.x;
      } else {
        horizontal.is_valid = false;
        horizontal.alignment = target_rect.x;
      }
    }

    if (align === "center") {
      const target_half = target_rect.width / 2;
      const card_half = card_rect.width / 2;
      const center_alignment = target_rect.x + target_half - card_half;

      if (
        center_alignment >= 0 &&
        center_alignment + card_rect.width <= window.innerWidth
      ) {
        horizontal.is_valid = true;
        horizontal.alignment = center_alignment;
      } else {
        horizontal.is_valid = false;
        horizontal.alignment = center_alignment;
      }
    }

    if (align === "right") {
      const right_alignment = target_rect.right - card_rect.width;

      if (
        right_alignment + card_rect.width <= window.innerWidth &&
        right_alignment >= 0
      ) {
        horizontal.is_valid = true;
        horizontal.alignment = right_alignment;
      } else {
        horizontal.is_valid = false;
        horizontal.alignment = right_alignment;
      }
    }

    return horizontal;
  }

  cleanUp() {}
}

export default TooltipPlacement;
