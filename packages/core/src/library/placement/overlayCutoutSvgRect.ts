import UI from "../ui";
import { AjalaJourney } from "../main";
import Placement from "../placement";

class OverlayCutoutSvgRectPlacement {
  ajala: AjalaJourney;
  placement: Placement;
  ui: UI;
  constructor({
    ajala,
    placement,
    ui,
  }: {
    ajala: AjalaJourney;
    ui: UI;
    placement: Placement;
  }) {
    this.ajala = ajala;
    this.placement = placement;
    this.ui = ui;
  }

  calculatePlacmentDelta({ active_index }: { active_index: number }) {
    const delta = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      border_radius: 0,
    };
    const target_el = this.ui.getTargetElement(
      this.ajala.flatten_steps[active_index].target,
    );

    if (!target_el) return delta;

    const target_rect = target_el.getBoundingClientRect();
    const { spotlight } = this.placement.getMetadata({
      next_index: active_index,
    });

    // Clamp cutout value to remain in the viewport
    delta.x = Math.max(0, target_rect.x - spotlight.padding);
    delta.y = Math.max(0, target_rect.y - spotlight.padding);
    delta.width = Math.min(
      window.innerWidth,
      target_rect.width + spotlight.padding * 2,
    );
    delta.height = Math.min(
      window.innerWidth,
      target_rect.height + spotlight.padding * 2,
    );
    delta.border_radius = spotlight.border_radius;

    return delta;
  }
}

export default OverlayCutoutSvgRectPlacement;
