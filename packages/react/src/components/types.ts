import {
  AjalaJourney,
  TAjalaOptions,
  TAjalaSteps,
  TSteps,
  TAjalaEventTypes,
} from "ajala.js";
import { ComponentType, ReactNode } from "react";

export interface TReactAjalaCustomTooltipProps {
  active_step: TSteps | undefined | null;
  ajala: AjalaJourney | null;
}

type EventType = Extract<
  TAjalaEventTypes,
  | "onFinish"
  | "onNext"
  | "onPrev"
  | "onClose"
  | "onTransitionComplete"
  | "onStart"
>;
type TReactAjalaEventTypes = Partial<Record<EventType, (value: any) => void>>;

export interface TReactAjalaProviderProps extends TReactAjalaEventTypes {
  steps: TAjalaSteps[];
  options: Omit<TAjalaOptions, "custom_tooltip" | "custom_arrow">;
  children?: ReactNode;
  CustomTooltip?: ComponentType<TReactAjalaCustomTooltipProps>;
  CustomArrow?: ComponentType<any>;
  getInstance?: (value: AjalaJourney) => void;
}
