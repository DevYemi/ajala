import { linearInterpolate } from "@/utils/chunks";
import Walkthrough from "./base";
import { TPlacementAlign, TPlacementAxis, TTooltipPlacement } from "./types";
import UI from "./ui";

/**
 * Please note that every placement starts from  0,0 coordinates (top left edge corner).
 */

class Placement {
  walkthrough: Walkthrough;
  #ui: UI;
  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.walkthrough = walkthrough;
    this.#ui = ui;
  }

  getMetadata({
    next_index,
    placement,
  }: {
    next_index: number;
    placement?: TTooltipPlacement;
  }) {
    const axis_gutter =
      this.walkthrough.flatten_steps[next_index].tooltip_gutter ||
      this.walkthrough.options.tooltip_gutter ||
      10;
    const placement_loc =
      placement ||
      this.walkthrough.flatten_steps[next_index].tooltip_placement ||
      this.walkthrough.options.tooltip_placement ||
      "auto";
    const loc = placement_loc.split("_");
    return {
      placement: placement_loc,
      axis: loc[0] as TPlacementAxis,
      align: loc[1] as TPlacementAlign,
      axis_gutter,
    };
  }

  calculateArrowPlacmentDelta({
    active_index,
    placement,
  }: {
    active_index: number;
    placement: TTooltipPlacement;
  }) {
    const delta = {
      x: 0,
      y: 0,
      rotate: 0,
    };
    const target_el = this.#ui.getTargetElement(
      this.walkthrough.flatten_steps[active_index].target,
    );

    if (!target_el) return delta;

    const target_rect = target_el.getBoundingClientRect();
    const arrow_rect = this.#ui.arrow_element.getBoundingClientRect();
    const tooltip_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
    const { axis, align } = this.getMetadata({
      next_index: active_index,
      placement,
    });

    const align_offset = 3;

    // handle Vertical Axis and Horizonal Alignment
    if (axis === "top" || axis === "bottom") {
      if (align === "left") {
        let value = linearInterpolate(0, tooltip_rect.width, 0.05);

        // Adjust for target with really small width
        if (target_rect.width < tooltip_rect.width / 2) {
          value = -arrow_rect.width / 2 + target_rect.width / 2;
        }
        delta.x = value;
      } else if (align === "center") {
        let value = linearInterpolate(0, tooltip_rect.width, 0.5);
        value = value - arrow_rect.width / 2;
        delta.x = value;
      } else if (align === "right") {
        let value = linearInterpolate(0, tooltip_rect.width, 0.95);
        value = value - arrow_rect.width;

        // Adjust for target with really small width
        if (target_rect.width < tooltip_rect.width / 2) {
          value =
            tooltip_rect.width - arrow_rect.width / 2 - target_rect.width / 2;
        }
        delta.x = value;
      }

      if (axis === "top") {
        delta.rotate = 180;
        delta.y = tooltip_rect.height - arrow_rect.height / 2 + align_offset;
      } else if (axis === "bottom") {
        delta.rotate = 0;
        delta.y = -(arrow_rect.height / 2) - align_offset;
      }
    }

    // handle Horixontal Axis and Vertical Alignment
    if (axis === "left" || axis === "right") {
      if (align === "top") {
        let value = linearInterpolate(0, tooltip_rect.height, 0.1);

        // Adjust for target with really small height
        if (target_rect.height < tooltip_rect.height / 2) {
          value = -arrow_rect.height / 2 + target_rect.height / 2;
        }
        delta.y = value;
      } else if (align === "center") {
        let value = linearInterpolate(0, tooltip_rect.height, 0.5);
        value = value - arrow_rect.height / 2;
        delta.y = value;
      } else if (align === "bottom") {
        let value = linearInterpolate(0, tooltip_rect.height, 0.9);
        value = value - arrow_rect.height;

        // Adjust for target with really small height
        if (target_rect.height < tooltip_rect.height / 2) {
          value =
            tooltip_rect.height -
            arrow_rect.height / 2 -
            target_rect.height / 2;
        }
        delta.y = value;
      }

      if (axis === "left") {
        delta.rotate = 90;
        delta.x = tooltip_rect.width - arrow_rect.width / 2 + align_offset;
      } else if (axis === "right") {
        delta.rotate = -90;
        delta.x = -(arrow_rect.width / 2) - align_offset;
      }
    }

    return delta;
  }

  calTooltipPlacementDelta({
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
      placement: metadata_placement,
    } = this.getMetadata({ next_index });

    const axis_delta = this.#calculateTooltipAxis({
      axis: axis,
      target: target,
      axis_gutter,
    });
    const y_alignment_delta = this.#calculateTooltipYAlignment({
      align: align,
      target: target,
    });
    const x_alignment_delta = this.#calculateTooltipXAlignment({
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
          this.#calculateTooltipAuto({
            target: target,
            axis_gutter,
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
          this.#calculateTooltipAuto({
            target: target,
            axis_gutter,
          });

        x_delta = auto_x_delta;
        y_delta = auto_y_delta;
        placement = auto_placement;
      }
    } else {
      const { auto_x_delta, auto_y_delta, auto_placement } =
        this.#calculateTooltipAuto({
          target: target,
          axis_gutter,
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

  #calculateTooltipAuto({
    target,
    axis_gutter,
  }: {
    target: HTMLElement;
    axis_gutter: number;
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

      const axis_delta = this.#calculateTooltipAxis({
        axis: axis,
        target: target,
        axis_gutter,
      });
      const y_alignment_delta = this.#calculateTooltipYAlignment({
        align: align,
        target: target,
      });
      const x_alignment_delta = this.#calculateTooltipXAlignment({
        align: align,
        target: target,
      });

      console.log({
        axis_delta,
        y_alignment_delta,
        x_alignment_delta,
        auto_placement,
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

  #calculateTooltipAxis({
    axis,
    target,
    axis_gutter,
  }: {
    axis?: TPlacementAxis;
    target: HTMLElement;
    axis_gutter: number;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
    const result = {
      is_valid: false,
      axis: 0,
    };

    if (axis === "top") {
      const top_position = target_rect.y - card_rect.height - axis_gutter;
      if (top_position >= 0 && target_rect.y <= window.innerHeight) {
        result.is_valid = true;
        result.axis = top_position;
      } else {
        result.is_valid = false;
        result.axis = top_position;
      }
    }

    if (axis === "bottom") {
      const bottom_position = target_rect.bottom + axis_gutter;
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
      const left_position = target_rect.x - card_rect.width - axis_gutter;
      if (left_position >= 0 && target_rect.x <= window.innerWidth) {
        result.is_valid = true;
        result.axis = left_position;
      } else {
        result.is_valid = false;
        result.axis = left_position;
      }
    }
    if (axis === "right") {
      const right_position = target_rect.right + axis_gutter;
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

  #calculateTooltipYAlignment({
    align,
    target,
  }: {
    align?: TPlacementAlign;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const tooltip_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
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

  #calculateTooltipXAlignment({
    align,
    target,
  }: {
    align?: TPlacementAlign;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
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

export default Placement;
