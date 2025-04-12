import {
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
import "@/style.css";
import Navigation from "./navigation";

class Walkthrough {
  options: TWalkthroughOptions;
  is_active: boolean;
  original_steps: Array<TWalkthroughSteps>;
  flatten_steps: Array<TSteps>;
  executed_steps: Set<TSteps>;
  #step_media_query: {
    active_size: number;
    fallback_sizes: Set<number>;
    instances: Array<MediaQueryList>;
    queries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>>;
  };
  active_step_index: number;
  active_step: TSteps | undefined;
  #ui: UI;
  navigation: Navigation;

  constructor(
    steps: Array<TWalkthroughSteps>,
    { run_immediately = true, ...options }: TWalkthroughOptions = {
      run_immediately: true,
    },
  ) {
    this.options = { run_immediately, ...options };
    this.is_active = Boolean(this.options.run_immediately);
    this.original_steps = steps;
    this.executed_steps = new Set();
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
    this.active_step_index = 0;
    this.active_step = this.flatten_steps[this.active_step_index];
    this.#ui = new UI(this);
    this.navigation = new Navigation({
      walkthrough: this,
      ui: this.#ui,
    });
    this.#ui.navigation = this.navigation;
  }

  init() {
    this.#setUpStepsMediaQueries();
    this.#ui.init();
    this.navigation.init();

    if (this.is_active && this.options.run_immediately) {
      this.run();
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

  run() {
    this.is_active = true;
    this.#ui.run();
    this.navigation.run();
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
