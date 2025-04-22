import {
  TWalkthroughEventTypes,
  TMediaQuery,
  TSteps,
  TWalkthroughOptions,
  TWalkthroughSteps,
} from "@/library/types";
import {
  getMediaQuerySize,
  TParsedResponsiveStep,
  parseResponsiveSteps,
  mapResponsiveValueToSteps,
  flattenStepsToMediaQueryDefaults,
} from "@/utils/mediaQuerySteps";
import UI from "@/library/ui";
import Navigation from "@/library/navigation";
import EventEmitter from "@/library/EventEmitter";

class Walkthrough extends EventEmitter<TWalkthroughEventTypes> {
  options: TWalkthroughOptions;
  is_active: boolean;
  original_steps: Array<TWalkthroughSteps>;
  flatten_steps: Array<TSteps>;
  #step_media_query: {
    active_size: number;
    fallback_sizes: Set<number>;
    instances: Array<MediaQueryList>;
    queries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>>;
  };
  active_step: TSteps | undefined;
  #ui: UI;
  navigation: Navigation;

  constructor(
    steps: Array<TWalkthroughSteps>,
    { start_immediately = true, ...options }: TWalkthroughOptions = {
      start_immediately: true,
    },
  ) {
    super();
    this.options = { start_immediately, ...options };
    this.is_active = Boolean(this.options.start_immediately);
    this.original_steps = steps;
    this.#step_media_query = {
      active_size: 0,
      fallback_sizes: new Set(),
      instances: [],
      queries: parseResponsiveSteps(steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      steps,
      this.#step_media_query.queries,
    );
    this.active_step = this.flatten_steps[0];
    this.#ui = new UI(this);
    this.navigation = new Navigation({
      walkthrough: this,
      ui: this.#ui,
    });
    this.#ui.navigation = this.navigation;

    this.destroy = this.destroy.bind(this);
  }

  init() {
    this.#setUpStepsMediaQueries();
    this.#ui.init();
    this.navigation.init();

    if (this.is_active && this.options.start_immediately) {
      this.start();
    }
  }

  #setUpStepsMediaQueries() {
    for (const [query_key, query_value] of Object.entries(
      this.#step_media_query.queries,
    )) {
      const match_media = window.matchMedia(`(min-width: ${query_key})`);
      const query_size = getMediaQuerySize(query_key);
      this.#step_media_query.fallback_sizes.add(query_size);

      if (
        match_media.matches &&
        query_size > this.#step_media_query.active_size
      ) {
        this.#step_media_query.active_size = query_size;
        this.flatten_steps = mapResponsiveValueToSteps(
          this.flatten_steps,
          query_value!,
          "value",
        );
      }

      match_media.onchange = (event) => {
        if (event.matches && query_size > this.#step_media_query.active_size) {
          this.#step_media_query.fallback_sizes.add(query_size);
          this.#step_media_query.active_size = query_size;
          this.flatten_steps = mapResponsiveValueToSteps(
            this.flatten_steps,
            query_value!,
            "value",
          );
        } else {
          /**
           * User screen is now smaller than `active_size`, now map all current steps with `active_size` value to their default value
           */
          const prev_query_value =
            this.#step_media_query.queries[
              `${this.#step_media_query.active_size}px`
            ];
          this.flatten_steps = mapResponsiveValueToSteps(
            this.flatten_steps,
            prev_query_value!,
            "default",
          );

          /**
           * Check if there are any `fallback_sizes`, pick the maximum size and map it's value to all steps.
           */
          if (this.#step_media_query.fallback_sizes.size > 1) {
            this.#step_media_query.fallback_sizes.delete(query_size);
            const next_active_size = Math.max(
              ...Array.from(this.#step_media_query.fallback_sizes),
            );
            const next_query_value =
              this.#step_media_query.queries[`${next_active_size}px`];
            this.#step_media_query.active_size = next_active_size;
            this.flatten_steps = mapResponsiveValueToSteps(
              this.flatten_steps,
              next_query_value!,
              "value",
            );
          } else {
            this.#step_media_query.active_size = 0;
          }
        }
      };
      this.#step_media_query.instances.push(match_media);
    }
  }

  getActiveStepFlattenIndex() {
    const index = this.flatten_steps.findIndex(
      (item) => item.id === this.active_step?.id,
    );
    return Math.max(index, 0);
  }
  getActiveStepOriginalIndex() {
    const index = this.original_steps.findIndex(
      (item) => item.id === this.active_step?.id,
    );
    return Math.max(index, 0);
  }

  updateSteps(steps: Array<TWalkthroughSteps>, restart = true) {
    this.original_steps = steps;
    this.#step_media_query = {
      active_size: 0,
      fallback_sizes: new Set(),
      instances: [],
      queries: parseResponsiveSteps(steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      steps,
      this.#step_media_query.queries,
    );
    this.active_step = this.flatten_steps[0];

    if (restart) {
      this.cleanup();
      this.start();
    }
  }

  getActiveStep() {
    return this.active_step;
  }

  start() {
    this.is_active = true;
    this.#ui.start();
    this.navigation.start();
  }

  destroy() {
    this.is_active = false;
    this.#ui.destroy();
  }

  cleanup() {
    this.#step_media_query.instances.forEach((mq) => {
      mq.onchange = null;
    });
    this.#ui.cleanUp();
    this.navigation.cleanUp();
  }
}

export default Walkthrough;
