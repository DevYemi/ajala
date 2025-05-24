import { AjalaJourney } from "./main";

export type TPlacementAxis = "top" | "bottom" | "left" | "right";
type TPlacementXAlign = "left" | "center" | "right";
type TPlacementYAlign = "top" | "center" | "bottom";
export type TPlacementAlign = TPlacementXAlign | TPlacementYAlign;

export type TTooltipPlacement =
  | `${"top" | "bottom"}_${TPlacementXAlign}`
  | `${"left" | "right"}_${TPlacementYAlign}`
  | "auto";

export type TTransitionType = "traveller" | "popout";

export interface TUnresponsiveStepsProperties {
  id: string;
  data?: unknown;
  onActive?: (step: TAjalaSteps, self: AjalaJourney) => void;
  onInActive?: (step: TAjalaSteps, self: AjalaJourney) => void;
}

export type TResponsiveStepsProperties = {
  target?: string;
  title?: string;
  content?: string;
  order?: number;
  skip?: boolean;
  tooltip_gutter?: number;
  tooltip_placement?: TTooltipPlacement;
  spotlight_border_radius?: number;
  spotlight_padding?: number;
  scroll_duration?: number;
  transition_duration?: number;
  enable_target_interaction?: boolean;
  enable_overlay_close?: boolean;
};
export type TSteps = TUnresponsiveStepsProperties & TResponsiveStepsProperties;

export type TMediaQuery<T> = {
  [index in string]: T;
} & {
  default: T;
};

export type TAjalaSteps = {
  [property in keyof TResponsiveStepsProperties]:
    | TResponsiveStepsProperties[property]
    | TMediaQuery<TResponsiveStepsProperties[property]>;
} & TUnresponsiveStepsProperties;

export interface TAjalaOptions {
  start_immediately?: boolean;
  custom_tooltip?: HTMLElement | null;
  custom_arrow?: SVGSVGElement | null;
  tooltip_gutter?: number;
  tooltip_placement?: TTooltipPlacement;
  tooltip_width?: number;
  tooltip_height?: number;
  scroll_duration?: number;
  transition_duration?: number;
  transition_type?: TTransitionType;
  enable_target_interaction?: boolean;
  enable_overlay_close?: boolean;
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
  | "onFinish"
  | "onBeforeDomInsert"
  | "onAfterDomInsert"
  | "onBeforeDomRemove"
  | "onAfterDomRemove";
