import {
  TMediaQuery,
  TAjalaSteps,
  TResponsiveStepsProperties,
  TSteps,
  TUnresponsiveStepsProperties,
} from "../library/types";
import sortStepsByOrder from "./sortStepsByOrder";

export type TParsedResponsiveStep = {
  id: string;
  key: keyof TResponsiveStepsProperties;
  value: any;
  media_query: number;
  default: any;
};

export function parseResponsiveSteps(steps: Array<TAjalaSteps>) {
  const media_quries: Partial<TMediaQuery<Array<TParsedResponsiveStep>>> = {};
  const unresponsive_step_keys: Array<keyof TUnresponsiveStepsProperties> = [
    "id",
    "data",
    "onActive",
    "onInActive",
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    Object.keys(step).forEach((step_key: any) => {
      // Media quries are not allowed for unresponsive keys
      if (!unresponsive_step_keys.includes(step_key)) {
        const step_value = step[
          step_key as keyof TAjalaSteps
        ] as TMediaQuery<any>;

        // Handle as a Media Query property
        if (step_value && typeof step_value === "object") {
          Object.keys(step_value as any).forEach((query_key: any) => {
            if (query_key === "default") return;

            if (!Object.hasOwn(step_value, "default")) {
              const error_message = `Ajala step with id:"${step.id}" is missing a media query default value for the key "${step_key}". Please add a default value to avoid unexpected behavior.`;
              if (process.env.NODE_ENV === "development") {
                throw new Error(error_message);
              } else {
                console.error(error_message);
              }
            }

            const media_query_obj: TParsedResponsiveStep = {
              id: step.id,
              key: step_key,
              value: step_value[query_key],
              media_query: query_key,
              default: step_value["default"],
            };
            if (media_quries[query_key]) {
              media_quries[query_key].push(media_query_obj);
            } else {
              media_quries[query_key] = [media_query_obj];
            }
          });
        }
      }
    });
  }

  return media_quries;
}

/**
 *
 * @description This helps maps the media-query values to the correct step
 */
export function mapResponsiveValueToSteps<T>(
  steps: Array<T>,
  queries: TParsedResponsiveStep[],
  type: keyof TParsedResponsiveStep,
) {
  const deep_cloned_steps: Array<TSteps> = JSON.parse(JSON.stringify(steps));
  queries.forEach((query_value) => {
    const index = deep_cloned_steps.findIndex(
      (step: any) => step?.id === query_value.id,
    );

    if (index > -1) {
      deep_cloned_steps[index][query_value.key] = query_value[type];
    }
  });

  return sortStepsByOrder(deep_cloned_steps);
}

/**
 *
 * @description This helps flatten the steps by mapping all keys with a media query object to its active media query value
 */
export function flattenStepsToMediaQueryDefaults(
  steps: Array<TAjalaSteps>,
  media_queries_steps: Partial<TMediaQuery<TParsedResponsiveStep[]>>,
) {
  let deep_cloned_steps = JSON.parse(
    JSON.stringify(steps),
  ) as Array<TAjalaSteps>;

  Object.values(media_queries_steps).forEach((query_values) => {
    if (query_values) {
      deep_cloned_steps = mapResponsiveValueToSteps(
        deep_cloned_steps,
        query_values,
        "default",
      );
    }
  });

  return deep_cloned_steps as Array<TSteps>;
}
