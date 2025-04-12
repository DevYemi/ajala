import Walkthrough from "./base";
import { TPlacementAlign, TPlacementAxis, TTooltipPlacement } from "./types";
import UI from "./ui";

class Placement {
  walkthrough: Walkthrough;
  #ui: UI;
  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.walkthrough = walkthrough;
    this.#ui = ui;
  }

  calculateAuto({ target }: { target: HTMLElement }) {
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

    for (let i = 0; i < all_placement.length; i++) {
      const loc = all_placement[i].split("_");
      const axis = loc[0] as TPlacementAxis;
      const align = loc[1] as TPlacementAlign;

      const axis_delta = this.calculateAxis({
        axis: axis,
        target: target,
      });
      const y_alignment_delta = this.calculateYAlignment({
        align: align,
        target: target,
      });
      const x_alignment_delta = this.calculateXAlignment({
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
        console.log({
          axis_delta,
          y_alignment_delta,
          i,
          align,
          axis,
        });
        auto_x_delta = axis_delta.axis;
        auto_y_delta = y_alignment_delta.alignment;
        break;
      }

      if (i === all_placement.length - 1) {
        auto_x_delta = axis_delta.axis;
        auto_y_delta = x_alignment_delta.alignment;
      }
    }

    console.log({
      auto_x_delta,
      auto_y_delta,
    });

    return {
      auto_x_delta,
      auto_y_delta,
    };
  }

  calculateAxis({
    axis,
    target,
  }: {
    axis?: TPlacementAxis;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
    const result = {
      is_valid: false,
      axis: 0,
    };

    if (axis === "top") {
      const top_position = target_rect.y - card_rect.height;
      if (top_position >= 0 && target_rect.y <= window.innerHeight) {
        result.is_valid = true;
        result.axis = top_position;
      } else {
        result.is_valid = false;
        result.axis = top_position;
      }
    }

    if (axis === "bottom") {
      if (
        target_rect.bottom + card_rect.height >= 0 &&
        target_rect.bottom + card_rect.height <= window.innerHeight
      ) {
        result.is_valid = true;
        result.axis = target_rect.bottom;
      } else {
        result.is_valid = false;
        result.axis = target_rect.bottom;
      }
    }

    if (axis === "left") {
      const left_position = target_rect.x - card_rect.width;
      if (left_position >= 0 && target_rect.x <= window.innerWidth) {
        result.is_valid = true;
        result.axis = left_position;
      } else {
        result.is_valid = false;
        result.axis = left_position;
      }
    }
    if (axis === "right") {
      if (
        target_rect.right >= 0 &&
        target_rect.right + card_rect.width <= window.innerWidth
      ) {
        console.log(target);
        result.is_valid = true;
        result.axis = target_rect.right;
      } else {
        result.is_valid = false;
        result.axis = target_rect.right;
      }
    }

    return result;
  }

  calculateYAlignment({
    align,
    target,
  }: {
    align?: TPlacementAlign;
    target: HTMLElement;
  }) {
    const target_rect = target.getBoundingClientRect();
    const card_rect =
      this.#ui.tooltip_container_element.getBoundingClientRect();
    const vertical = {
      is_valid: false,
      alignment: 0,
    };

    if (align === "top") {
      if (
        target_rect.y + card_rect.height <= window.innerHeight &&
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
      const card_half = card_rect.height / 2;
      const center_alignment = target_rect.y + target_half - card_half;
      if (
        center_alignment - card_half > 0 &&
        center_alignment + card_half < window.innerHeight
      ) {
        vertical.is_valid = true;
        vertical.alignment = center_alignment;
      } else {
        vertical.is_valid = false;
        vertical.alignment = center_alignment;
      }
    }

    if (align === "bottom") {
      const bottom_alignment = target_rect.bottom - card_rect.height;
      if (
        bottom_alignment <= window.innerHeight &&
        bottom_alignment - card_rect.height >= 0
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

  calculateXAlignment({
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
