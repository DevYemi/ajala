export type TPlacementAxis = "top" | "bottom" | "left" | "right";
type TPlacementXAlign = "left" | "center" | "right";
type TPlacementYAlign = "top" | "center" | "bottom";
export type TPlacementAlign = TPlacementXAlign | TPlacementYAlign;

export type TTooltipPlacement =
  | `${"top" | "bottom"}_${TPlacementXAlign}`
  | `${"left" | "right"}_${TPlacementYAlign}`
  | "auto";

export interface TSteps {
  id: string;
  target: string;
  title?: string;
  content?: string;
  data?: unknown;
  order?: number;
  skip?: boolean;
  gutter?: number;
  tooltip_placement?: TTooltipPlacement;
}

export type TMediaQuery<T> = {
  [index in `${number}px`]: T;
} & {
  default: T;
};

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
  run_immediately?: boolean;
  custom_tooltip?: HTMLElement;
  gutter?: number;
  tooltip_placement?: TTooltipPlacement;
  default_tooltip_options?: Partial<{
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
    hide: boolean;
  }>;
}

export interface TTravelDistanceData {
  is_valid: boolean;
  scrolled: boolean;
  y_delta: number;
  x_delta: number;
  y_offset: number;
  x_offset: number;
  active_index: number;
  card_rect: null | DOMRect;
  target_rect: null | DOMRect;
}
