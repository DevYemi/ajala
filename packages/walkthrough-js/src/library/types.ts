export type TMediaQuery<T> = {
  [index in `${number}px`]: T;
} & {
  default: T;
};

export interface TSteps {
  id: string;
  target: string | HTMLElement;
  title?: string;
  content?: string;
  data?: unknown;
  order?: number;
  skip?: boolean;
}
/**
 * Steps properties that can be overridden by media queries
 */
export type TResponsiveStepsProperties = Omit<TSteps, "id" | "data">;

export type TWalkthroughSteps = {
  [property in keyof TResponsiveStepsProperties]:
    | TResponsiveStepsProperties[property]
    | TMediaQuery<TResponsiveStepsProperties[property]>;
} & {
  id: string;
  data?: unknown;
};

export interface TWalkthroughOptions {
  steps: Array<TWalkthroughSteps>;
  custom_card_element?: HTMLElement;
  default_card_element_options?: Partial<{
    class_name: string;
    hide_dot_nav: boolean;
    hide_close_btn: boolean;
    hide_header: boolean;
    hide_footer: boolean;
    hide_prev_btn: boolean;
    hide_next_btn: boolean;
    hide_title: boolean;
    hide_content: boolean;
  }>;
  overlay_options?: Partial<{
    class_name: string;
    background_color: string;
    opacity: number;
  }>;
}
