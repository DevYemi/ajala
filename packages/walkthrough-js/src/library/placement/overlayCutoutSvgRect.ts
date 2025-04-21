import { TTooltipPlacement } from "../types";
import UI from "../ui";
import Walkthrough from "../base";
import Placement from ".";
import Animations from "../animations";

class OverlayCutoutSvgRectPlacement {
  walkthrough: Walkthrough;
  placement: Placement;
  ui: UI;
  animations: Animations;
  constructor({
    walkthrough,
    placement,
    ui,
  }: {
    walkthrough: Walkthrough;
    ui: UI;
    placement: Placement;
  }) {
    this.walkthrough = walkthrough;
    this.placement = placement;
    this.ui = ui;
    this.animations = new Animations({ walkthrough, ui, placement });
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
      this.walkthrough.flatten_steps[active_index].target,
    );

    if (!target_el) return delta;

    const target_rect = target_el.getBoundingClientRect();
    const { spotlight } = this.placement.getMetadata({
      next_index: active_index,
    });

    delta.x = Math.max(0, target_rect.x - spotlight.padding);
    delta.y = Math.max(0, target_rect.y - spotlight.padding);
    delta.width = Math.min(
      window.innerWidth,
      target_rect.width + spotlight.padding,
    );
    delta.height = Math.min(
      window.innerWidth,
      target_rect.height + spotlight.padding,
    );
    delta.border_radius = spotlight.border_radius;

    return delta;
  }

  cleanUp() {}
}

export default OverlayCutoutSvgRectPlacement;
