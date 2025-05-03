import {
  TAjalaEventTypes,
  TMediaQuery,
  TSteps,
  TAjalaOptions,
  TAjalaSteps,
} from "./types";
import {
  TParsedResponsiveStep,
  parseResponsiveSteps,
  mapResponsiveValueToSteps,
  flattenStepsToMediaQueryDefaults,
} from "../utils/mediaQuerySteps";
import UI from "./ui";
import Navigation from "./navigation";
import EventEmitter from "./EventEmitter";
import { checkForStepsIdValidity } from "../utils/chunks";
import Placement from "./placement";
import Animations from "./animations";

export class AjalaJourney extends EventEmitter<TAjalaEventTypes> {
  options: TAjalaOptions;
  is_active: boolean;
  initialized: boolean;
  original_steps: Array<TAjalaSteps>;
  flatten_steps: Array<TSteps>;
  #step_media_query: {
    instances: Array<MediaQueryList>;
    queries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>>;
  };
  active_step: TSteps | undefined;
  #ui: UI;
  #navigation: Navigation;
  #placement: Placement;
  #animations: Animations;

  constructor(
    steps: Array<TAjalaSteps>,
    { start_immediately = true, ...options }: TAjalaOptions = {
      start_immediately: true,
    },
  ) {
    super();
    const validated_steps = checkForStepsIdValidity(steps);
    this.options = { start_immediately, ...options };
    this.is_active = Boolean(this.options.start_immediately);
    this.original_steps = validated_steps;
    this.#step_media_query = {
      instances: [],
      queries: {},
    };
    this.flatten_steps = [];
    this.initialized = true;
    this.active_step = this.flatten_steps[0];
    this.#ui = new UI(this);
    this.#navigation = new Navigation({
      ajala: this,
      ui: this.#ui,
    });
    this.#placement = new Placement({ ajala: this, ui: this.#ui });
    this.#animations = new Animations({
      ajala: this,
      ui: this.#ui,
      placement: this.#placement,
    });
    this.#ui.navigation = this.#navigation;
    this.#ui.placement = this.#placement;
    this.#navigation.placement = this.#placement;
    this.#navigation.animations = this.#animations;
    this.#placement.animations = this.#animations;

    this.destroy = this.destroy.bind(this);
  }

  /**
   * @desc This method initializes the ajala by setting up media queries and UI elements.
   */
  init(start_immediately?: boolean) {
    this.initialized = true;
    const validated_steps = checkForStepsIdValidity(this.original_steps);
    this.is_active = Boolean(this.options.start_immediately);
    this.original_steps = validated_steps;
    this.#step_media_query = {
      instances: [],
      queries: parseResponsiveSteps(validated_steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      validated_steps,
      this.#step_media_query.queries,
    );

    this.active_step = this.flatten_steps[0];

    this.#setUpStepsMediaQueries();
    this.active_step = this.flatten_steps[0];
    this.is_active = Boolean(this.options.start_immediately);

    this.#ui.init();
    this.#navigation.init();

    if (this.options.start_immediately || start_immediately) {
      this.start();
    }
  }

  /**
   * @desc Get flatten steps.
   * Flatten steps are the steps after all media queries have been applied based on current screen size.
   */
  getFlattenSteps() {
    return this.flatten_steps;
  }

  /**
   * @desc Get original steps provided to ajala.
   */
  getOriginalSteps() {
    return this.original_steps;
  }

  /**
   * @desc Get index of the active step in the flatten array.
   * Flatten array is the array of steps after all media queries have been applied based on current screen size.
   */
  getActiveStepFlattenIndex() {
    const index = this.flatten_steps.findIndex(
      (item) => item.id === this.active_step?.id,
    );
    return Math.max(index, 0);
  }

  /**
   * @desc Get index of the active step in the original array.
   * Original array is the array of steps initially provided .
   */
  getActiveStepOriginalIndex() {
    const index = this.original_steps.findIndex(
      (item) => item.id === this.active_step?.id,
    );
    return Math.max(index, 0);
  }

  /**
   * @desc Updates the ajala journey steps.
   * @param steps - The new steps to be set.
   * @param restart - Whether to restart the ajala after updating the steps.
   */
  updateSteps(steps: Array<TAjalaSteps>, restart = true) {
    const validated_steps = checkForStepsIdValidity(steps);
    this.original_steps = validated_steps;
    this.#step_media_query = {
      instances: [],
      queries: parseResponsiveSteps(validated_steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      validated_steps,
      this.#step_media_query.queries,
    );
    this.active_step = this.flatten_steps[0];

    if (restart) {
      this.restart();
    }
  }

  /**
   * @desc Updates the ajala journey options.
   * @param options - The new options to be set.
   * @param restart - Whether to restart the ajala after updating the steps.
   */
  updateOptions(options: Partial<TAjalaOptions>, restart = false) {
    this.options = {
      ...this.options,
      ...options,
    };

    if (restart) {
      this.restart();
    }
  }

  /**
   * @desc Get current active step in ajala journey.
   * @returns The current active step.
   */
  getActiveStep() {
    return this.active_step;
  }

  /**
   * @desc Check if the current active step is the last step in ajala journey.
   * @returns Boolean
   */
  isLastStep() {
    if (this.getActiveStepFlattenIndex() === this.flatten_steps.length - 1) {
      return true;
    }

    return false;
  }

  /**
   * @desc Check if the current active step is the first step in ajala journey.
   * @returns Boolean
   */
  isFirstStep() {
    if (this.getActiveStepFlattenIndex() === 0) {
      return true;
    }

    return false;
  }

  /**
   * @desc starts ajala.
   */
  start() {
    this.is_active = true;
    this.active_step = this.flatten_steps[0];
    this.#ui.start();
    this.#navigation.start();

    this.dispatchEvent({
      type: "onStart",
      data: this,
    });
  }

  /**
   * @desc restarts ajala.
   * In a way it is like a reset.
   */
  restart() {
    this.destroy();
    this.init(true);
  }

  /**
   * @desc Move to the next step in ajala journey.
   */
  next() {
    if (!this.is_active) return;
    this.#navigation.next();
  }

  /**
   * @desc Move to the previous step in the ajala journey.
   */
  prev() {
    if (!this.is_active) return;
    this.#navigation.prev();
  }

  /**
   * @desc Manually goes to the step with the given id.
   * @param id - The id of the step to go to.
   */
  goToStep(id: string) {
    if (!this.is_active) return;
    const index = this.flatten_steps.findIndex((item) => item.id === id);
    if (index > -1) {
      this.#navigation.goTo(index);
    }
  }

  /**
   * @desc Manually trigger a recalculation of the UI elements.
   */
  refresh() {
    if (!this.is_active) return;
    this.#ui.refresh();
  }

  /**
   * @desc This method manually stops the ajala and remove all the UI elements after cleanups.
   */
  destroy() {
    this.#cleanup();
    this.#ui.destroy();
    this.is_active = false;
  }

  #cleanup() {
    this.#step_media_query.instances.forEach((mq) => {
      mq.onchange = null;
    });
    this.#ui.cleanUp();
    this.#navigation.cleanUp();
  }

  #setUpStepsMediaQueries() {
    for (const [query_key, query_value] of Object.entries(
      this.#step_media_query.queries,
    )) {
      const match_media = window.matchMedia(query_key);

      if (match_media.matches) {
        this.flatten_steps = mapResponsiveValueToSteps(
          this.flatten_steps,
          query_value!,
          "value",
        );
      }

      match_media.onchange = (event) => {
        const step_query = this.#step_media_query.queries[event.media];
        if (event.matches && step_query) {
          this.flatten_steps = mapResponsiveValueToSteps(
            this.flatten_steps,
            step_query,
            "value",
          );
        } else {
          if (step_query) {
            this.flatten_steps = mapResponsiveValueToSteps(
              this.flatten_steps,
              step_query,
              "default",
            );
          }

          this.#step_media_query.instances.forEach((mq) => {
            const query_step = this.#step_media_query.queries[mq.media];
            if (mq.matches && query_step) {
              this.flatten_steps = mapResponsiveValueToSteps(
                this.flatten_steps,
                query_step,
                "value",
              );
            }
          });
        }

        // Restart Ajala journey each time the screen size changes
        this.goToStep(this.flatten_steps[0].id);
      };
      this.#step_media_query.instances.push(match_media);
    }
  }
}
