import Walkthrough from "./base";
import Placement from "./placement";
import UI from "./ui";
import Animations from "./animations";
import { createDebounceFunc } from "@/utils/chunks";

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

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.close = this.close.bind(this);

    this.refresh = createDebounceFunc(this.refresh.bind(this), 200) as any;
  }

  init() {
    window.addEventListener("resize", this.refresh);
  }

  async next() {
    if (this.#animations.is_animating) return;
    const next_index = this.walkthrough.active_step_index + 1;

    if (this.walkthrough.flatten_steps.length > next_index) {
      this.walkthrough.dispatchEvent({
        type: "onNext",
        data: null,
      });
      this.#ui.resetOverlayCutoutSvgRect();

      const distance_option =
        await this.#placement.tooltip.calculateTravelDistance(next_index);
      const onComplete = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = next_index;

        this.walkthrough.dispatchEvent({
          type: "onTransitionComplete",
          data: {
            transitionType: "next",
          },
        });
      };

      this.#animations.transition[this.#animations.transition_type](
        distance_option,
        {
          onComplete: onComplete,
        },
      );
    } else {
      this.walkthrough.dispatchEvent({
        type: "onFinish",
        data: null,
      });

      this.walkthrough.destroy();
    }
  }

  async prev() {
    if (this.#animations.is_animating) return;
    const prev_index = this.walkthrough.active_step_index - 1;

    if (prev_index > -1) {
      this.walkthrough.dispatchEvent({
        type: "onPrev",
        data: this.walkthrough,
      });
      this.#ui.resetOverlayCutoutSvgRect();

      const distance_option =
        await this.#placement.tooltip.calculateTravelDistance(prev_index);

      const onComplete = () => {
        this.walkthrough.active_step =
          this.walkthrough.flatten_steps[distance_option.active_index];
        this.walkthrough.active_step_index = prev_index;

        this.walkthrough.dispatchEvent({
          type: "onTransitionComplete",
          data: {
            transitionType: "prev",
          },
        });
      };

      this.#animations.transition[this.#animations.transition_type](
        distance_option,
        {
          onComplete: onComplete,
        },
      );
    }
  }

  close() {
    this.walkthrough.dispatchEvent({
      type: "onClose",
      data: null,
    });
    this.walkthrough.destroy();
  }

  async refresh() {
    this.#ui.resetOverlayCutoutSvgRect();
    const distance_option =
      await this.#placement.tooltip.calculateTravelDistance(
        this.walkthrough.active_step_index,
      );

    this.#animations.transition[this.#animations.transition_type](
      distance_option,
    );
  }

  async start() {
    this.walkthrough.dispatchEvent({
      type: "onStart",
      data: this.walkthrough,
    });

    const distance_option =
      await this.#placement.tooltip.calculateTravelDistance(0);

    this.#animations.transition[this.#animations.transition_type](
      distance_option,
    );
  }

  cleanUp() {
    window.removeEventListener("resize", this.refresh);
    this.#placement.cleanUp();
  }
}

export default Navigation;
