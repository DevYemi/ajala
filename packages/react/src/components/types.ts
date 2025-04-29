import { AjalaJourney, TAjalaOptions, TAjalaSteps, TSteps } from "ajala.js";
import { ComponentType, ReactNode } from "react";

export interface TReactAjalaCustomTooltipProps {
  active_step: TSteps | undefined | null;
  ajala: AjalaJourney | null;
}

export interface TReactAjalaProviderProps {
  steps: TAjalaSteps[];
  options: Omit<TAjalaOptions, "custom_tooltip" | "custom_arrow">;
  children?: ReactNode;
  CustomTooltip?: ComponentType<TReactAjalaCustomTooltipProps>;
  CustomArrow?: ComponentType<any>;
  getInstance?: (value: AjalaJourney) => void;
}
