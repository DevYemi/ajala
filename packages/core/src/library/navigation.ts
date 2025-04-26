import { AjalaJourney } from "./main";
import Placement from "./placement";
import UI from "./ui";
import Animations from "./animations";

class Navigation {
  ajala: AjalaJourney;
  ui: UI;
  placement?: Placement;
  animations?: Animations;

  constructor({ ajala, ui }: { ajala: AjalaJourney; ui: UI }) {
    this.ajala = ajala;
    this.ui = ui;

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.close = this.close.bind(this);
  }

  init() {}

  async goTo(index: number) {
    if (this.animations?.is_animating) return;

    if (index >= 0 && index <= this.ajala.flatten_steps.length) {
      this.animations!.is_animating = true;
      this.ui.resetOverlayCutoutSvgRect();

      const distance_option =
        await this.placement!.tooltip.calculateTravelDistance(index);

      const onComplete = () => {
        this.animations!.is_animating = false;
        this.ajala.active_step =
          this.ajala.flatten_steps[distance_option.active_index];

        this.ui.update(distance_option);

        this.ajala.dispatchEvent({
          type: "onTransitionComplete",
          data: {
            transitionType: "goTo",
            self: this.ajala,
          },
        });
      };

      this.animations!.transition[this.animations!.transition_type](
        distance_option,
        {
          onComplete: onComplete,
        },
      );
    }
  }

  async next() {
    if (this.animations!.is_animating) return;
    const next_index = this.ajala.getActiveStepFlattenIndex() + 1;

    if (this.ajala.flatten_steps.length > next_index) {
      this.animations!.is_animating = true;
      this.ajala.dispatchEvent({
        type: "onNext",
        data: this.ajala,
      });
      this.ui!.resetOverlayCutoutSvgRect();

      const distance_option =
        await this.placement!.tooltip.calculateTravelDistance(next_index);
      const onComplete = () => {
        this.animations!.is_animating = false;
        this.ajala.active_step =
          this.ajala.flatten_steps[distance_option.active_index];

        this.ui!.update(distance_option);

        this.ajala.dispatchEvent({
          type: "onTransitionComplete",
          data: {
            transitionType: "next",
            self: this.ajala,
          },
        });
      };

      this.animations!.transition[this.animations!.transition_type](
        distance_option,
        {
          onComplete: onComplete,
        },
      );
    } else {
      this.ajala.dispatchEvent({
        type: "onFinish",
        data: this.ajala,
      });

      this.ajala.destroy();
    }
  }

  async prev() {
    if (this.animations!.is_animating) return;
    const prev_index = this.ajala.getActiveStepFlattenIndex() - 1;

    if (prev_index > -1) {
      this.animations!.is_animating = true;
      this.ajala.dispatchEvent({
        type: "onPrev",
        data: this.ajala,
      });
      this.ui!.resetOverlayCutoutSvgRect();

      const distance_option =
        await this.placement!.tooltip.calculateTravelDistance(prev_index);

      const onComplete = () => {
        this.animations!.is_animating = false;
        this.ajala.active_step =
          this.ajala.flatten_steps[distance_option.active_index];

        this.ui!.update(distance_option);

        this.ajala.dispatchEvent({
          type: "onTransitionComplete",
          data: {
            transitionType: "prev",
            self: this.ajala,
          },
        });
      };

      this.animations!.transition[this.animations!.transition_type](
        distance_option,
        {
          onComplete: onComplete,
        },
      );
    }
  }

  close() {
    this.ajala.destroy();
    this.ajala.dispatchEvent({
      type: "onClose",
      data: this.ajala,
    });
  }

  async start() {
    const distance_option =
      await this.placement!.tooltip.calculateTravelDistance(0);

    this.animations!.transition[this.animations!.transition_type](
      distance_option,
    );

    this.ui.update(distance_option);
  }

  cleanUp() {
    this.placement!.cleanUp();
  }
}

export default Navigation;
