import Walkthrough from "./base";
import Placement from "./placement";
import UI from "./ui";
import Animations from "./animations";

class Navigation {
  walkthrough: Walkthrough;
  #ui: UI;
  #placement: Placement;
  #animations: Animations;

  constructor({ walkthrough, ui }: { walkthrough: Walkthrough; ui: UI }) {
    this.walkthrough = walkthrough;
    this.#ui = ui;
    this.#placement = new Placement({ walkthrough, ui });
    this.#animations = new Animations({
      walkthrough,
      ui,
      placement: this.#placement,
    });

    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  init() {}

  async onNext() {
    const next_index = this.walkthrough.active_step_index + 1;

    if (this.walkthrough.flatten_steps.length > next_index) {
      this.#ui.resetOverlayCutoutSvgRect();
      const distance_option =
        await this.#placement.tooltip.calculateTravelDistance(next_index);
      const onComplete = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = next_index;
      };
      this.#animations.travelToLocation(distance_option, {
        onComplete: onComplete,
      });
    } else {
      this.onClose();
    }
  }

  async onPrev() {
    const prev_index = this.walkthrough.active_step_index - 1;

    if (prev_index > -1) {
      this.#ui.resetOverlayCutoutSvgRect();
      const distance_option =
        await this.#placement.tooltip.calculateTravelDistance(prev_index);
      const onPlay = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = prev_index;
      };
      this.#animations.travelToLocation(distance_option, { onPlay: onPlay });
    }
  }

  onClose() {
    console.log("onClose", this);
  }

  async run() {
    // document.body.style.overflow = "hidden";
    const distance_option =
      await this.#placement.tooltip.calculateTravelDistance(0);
    this.#animations.travelToLocation(distance_option);
  }

  cleanUp() {}
}

export default Navigation;
