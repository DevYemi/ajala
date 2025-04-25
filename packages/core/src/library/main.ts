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

export class AjalaJourney extends EventEmitter<TAjalaEventTypes> {
  options: TAjalaOptions;
  is_active: boolean;
  original_steps: Array<TAjalaSteps>;
  flatten_steps: Array<TSteps>;
  #step_media_query: {
    instances: Array<MediaQueryList>;
    queries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>>;
  };
  active_step: TSteps | undefined;
  #ui: UI;
  #navigation: Navigation;

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
      queries: parseResponsiveSteps(validated_steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      validated_steps,
      this.#step_media_query.queries,
    );
    this.active_step = this.flatten_steps[0];
    this.#ui = new UI(this);
    this.#navigation = new Navigation({
      ajala: this,
      ui: this.#ui,
    });
    this.#ui.navigation = this.#navigation;

    this.destroy = this.destroy.bind(this);
  }

  /**
   * @desc This method initializes the ajala by setting up media queries and UI elements.
   */
  init() {
    this.#setUpStepsMediaQueries();
    this.#ui.init();
    this.#navigation.init();

    if (this.is_active && this.options.start_immediately) {
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
      this.#cleanup();
      this.start();
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
   * @desc starts ajala.
   * Can also be used to restart the ajala journey.
   */
  start() {
    this.is_active = true;
    this.#ui.start();
    this.#navigation.start();

    setTimeout(() => {
      this.dispatchEvent({
        type: "onStart",
        data: this,
      });
    }, 250);
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
    this.#navigation.refresh();
  }

  /**
   * @desc This method manually stops the ajala and remove all the UI elements after cleanups.
   */
  destroy() {
    this.is_active = false;
    this.#cleanup();
    this.#ui.destroy();
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
        console.log(this);
      };
      this.#step_media_query.instances.push(match_media);
    }
  }
}
