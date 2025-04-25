export type TPlacementAxis = "top" | "bottom" | "left" | "right";
type TPlacementXAlign = "left" | "center" | "right";
type TPlacementYAlign = "top" | "center" | "bottom";
export type TPlacementAlign = TPlacementXAlign | TPlacementYAlign;

export type TTooltipPlacement =
  | `${"top" | "bottom"}_${TPlacementXAlign}`
  | `${"left" | "right"}_${TPlacementYAlign}`
  | "auto";

export type TTransitionType = "traveller" | "popout";
export interface TSteps {
  id: string;
  target: string;
  title?: string;
  content?: string;
  data?: unknown;
  order?: number;
  skip?: boolean;
  tooltip_gutter?: number;
  tooltip_placement?: TTooltipPlacement;
  spotlight_border_radius?: number;
  spotlight_padding?: number;
  scroll_duration?: number;
  transition_duration?: number;
  enable_target_interaction?: boolean;
}

export type TMediaQuery<T> = {
  [index in string]: T;
} & {
  default: T;
};

/**
 * Steps properties that can be overridden by media queries
 */
export type TResponsiveStepsProperties = Omit<TSteps, "id" | "data">;

export type TAjalaSteps = {
  [property in keyof TResponsiveStepsProperties]:
    | TResponsiveStepsProperties[property]
    | TMediaQuery<TResponsiveStepsProperties[property]>;
} & {
  id: string;
  data?: unknown;
};

export interface TAjalaOptions {
  start_immediately?: boolean;
  custom_tooltip?: HTMLElement | null;
  custom_arrow?: SVGSVGElement | null;
  tooltip_gutter?: number;
  tooltip_placement?: TTooltipPlacement;
  scroll_duration?: number;
  transition_duration?: number;
  transition_type?: TTransitionType;
  enable_target_interaction?: boolean;
  default_tooltip_options?: Partial<{
    class_name: string;
    hide_dot_nav: boolean;
    hide_close_btn: boolean;
    hide_title: boolean;
    hide_content: boolean;
  }>;
  default_arrow_options?: Partial<{
    class_name: string;
    hide: boolean;
    size: number;
    color: string;
  }>;
  overlay_options?: Partial<{
    class_name: string;
    color: string;
    opacity: number;
    hide: boolean;
  }>;
  spotlight_options?: Partial<{
    border_radius: number;
    padding: number;
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
  tooltip_rect: null | DOMRect;
  target_rect: null | DOMRect;
  taregt_el: HTMLElement | null;
  placement: TTooltipPlacement;
}

export type TAjalaEventTypes =
  | "onStart"
  | "onNext"
  | "onPrev"
  | "onClose"
  | "onTransitionComplete"
  | "onFinish";
