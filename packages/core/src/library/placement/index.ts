import UI from "../ui";
import { AjalaJourney } from "../main";
import ArrowPlacement from "./arrow";
import TooltipPlacement from "./tooltip";
import { TPlacementAlign, TPlacementAxis, TTooltipPlacement } from "../types";
import OverlayCutoutSvgRectPlacement from "./overlayCutoutSvgRect";
import Animations from "../animations";

/**
 * Please note that every placement starts from  0,0 coordinates (top left edge corner).
 * Relative to it's parent element.
 */

class Placement {
  ajala: AjalaJourney;
  arrow: ArrowPlacement;
  tooltip: TooltipPlacement;
  overlay_cutout_svg_rect: OverlayCutoutSvgRectPlacement;
  ui: UI;
  animations?: Animations;
  constructor({ ajala, ui }: { ajala: AjalaJourney; ui: UI }) {
    this.arrow = new ArrowPlacement({ ajala, ui, placement: this });
    this.tooltip = new TooltipPlacement({ ajala, ui, placement: this });
    this.overlay_cutout_svg_rect = new OverlayCutoutSvgRectPlacement({
      ajala,
      ui,
      placement: this,
    });
    this.ajala = ajala;
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
      this.ajala.getFlattenSteps()[next_index].tooltip_gutter ||
      this.ajala.options.tooltip_gutter ||
      10;
    const placement_loc =
      placement ||
      this.ajala.getFlattenSteps()[next_index].tooltip_placement ||
      this.ajala.options.tooltip_placement ||
      "auto";
    const loc = placement_loc.split("_");

    const spotlight_padding =
      this.ajala.getFlattenSteps()[next_index].spotlight_padding ||
      this.ajala.options.spotlight_options?.padding ||
      0;
    const spotlight_border_radius =
      this.ajala.getFlattenSteps()[next_index].spotlight_border_radius ||
      this.ajala.options.spotlight_options?.border_radius ||
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
