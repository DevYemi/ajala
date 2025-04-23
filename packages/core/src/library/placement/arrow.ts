import { linearInterpolate } from "../../utils/chunks";

import { TTooltipPlacement } from "../types";
import UI from "../ui";
import Walkthrough from "../main";
import Placement from "../placement";

class ArrowPlacement {
  walkthrough: Walkthrough;
  placement: Placement;
  #ui: UI;
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
    this.#ui = ui;
    this.placement = placement;
  }

  calculatePlacmentDelta({
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
    const { axis, align } = this.placement.getMetadata({
      next_index: active_index,
      placement,
    });

    const align_offset = 2;

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

  cleanUp() {}
}

export default ArrowPlacement;
