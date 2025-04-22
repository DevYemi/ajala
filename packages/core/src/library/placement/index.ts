import UI from "../ui";
import Walkthrough from "../main";
import ArrowPlacement from "./arrow";
import TooltipPlacement from "./tooltip";
import { TPlacementAlign, TPlacementAxis, TTooltipPlacement } from "../types";
import OverlayCutoutSvgRectPlacement from "./overlayCutoutSvgRect";

/**
 * Please note that every placement starts from  0,0 coordinates (top left edge corner).
 * Relative to it's parent element.
 */

class Placement {
  walkthrough: Walkthrough;
  arrow: ArrowPlacement;
  tooltip: TooltipPlacement;
  overlay_cutout_svg_rect: OverlayCutoutSvgRectPlacement;
  ui: UI;
  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.arrow = new ArrowPlacement({ walkthrough, ui, placement: this });
    this.tooltip = new TooltipPlacement({ walkthrough, ui, placement: this });
    this.overlay_cutout_svg_rect = new OverlayCutoutSvgRectPlacement({
      walkthrough,
      ui,
      placement: this,
    });
    this.walkthrough = walkthrough;
    this.ui = ui;
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

    const spotlight_padding =
      this.walkthrough.flatten_steps[next_index].spotlight_padding ||
      this.walkthrough.options.spotlight_options?.padding ||
      0;
    const spotlight_border_radius =
      this.walkthrough.flatten_steps[next_index].spotlight_border_radius ||
      this.walkthrough.options.spotlight_options?.border_radius ||
      0;

    return {
      placement: placement_loc,
      axis: loc[0] as TPlacementAxis,
      align: loc[1] as TPlacementAlign,
      axis_gutter,
      spotlight: {
        padding: spotlight_padding,
        border_radius: spotlight_border_radius,
      },
    };
  }

  cleanUp() {}
}

export default Placement;
