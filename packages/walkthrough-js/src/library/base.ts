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

class Walkthrough {
  options: TWalkthroughOptions;
  original_steps: Array<TWalkthroughSteps>;
  flatten_steps: Array<TSteps>;
  executed_steps: Array<TSteps>;
  #step_media_query: {
    active_size: number;
    fallback_sizes: Set<number>;
    instances: Array<MediaQueryList>;
    queries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>>;
  };
  active_step_index: number | undefined;
  active_step: TWalkthroughSteps | undefined;
  #ui: UI;

  constructor(options: TWalkthroughOptions) {
    this.options = options;
    this.original_steps = options.steps;
    this.executed_steps = [];
    this.#step_media_query = {
      active_size: 0,
      fallback_sizes: new Set(),
      instances: [],
      queries: parseResponsiveSteps(options.steps),
    };
    this.flatten_steps = flattenStepsToMediaQueryDefaults(
      options.steps,
      this.#step_media_query.queries,
    );
    this.#ui = new UI(this);
  }

  init() {
    this.#setUpStepsMediaQueries();
    this.#ui.init();
    this.#start();
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

  #start() {}

  cleanup() {
    this.#step_media_query.instances.forEach((mq) => {
      mq.onchange = null;
    });
  }
}

export default Walkthrough;
