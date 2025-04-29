"use client";
import { AjalaJourney, TAjalaOptions, TSteps } from "ajala.js";
import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TReactAjalaProviderProps } from "./types";

const AjalaJourneyContext = createContext<AjalaJourney | null>(null);

function AjalaJourneyProvider({
  children,
  getInstance,
  steps,
  CustomTooltip,
  CustomArrow,
  options,
}: TReactAjalaProviderProps) {
  const [ajalaInstance, setAjalaInstance] = useState<AjalaJourney | null>(
    {} as any
  );
  const [activeStep, setActiveStep] = useState<TSteps>();
  const [customTooltipContainer, setTooltipContainer] =
    useState<HTMLElement | null>(null);
  const [customArrowContainer, setArrowContainer] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    /**
     * Create a dummy tooltip and arrow and pass it to ajala if a CustomTooltip or CustomArrow component was passed.
     * This is needed to prevent ajala from creating it's default so we can inject our custom react tooltip and arrow.
     */
    let dummy_custom_tooltip = null;
    let dummy_custom_arrow = null;
    const element = document.createElement("div");
    if (CustomTooltip) {
      dummy_custom_tooltip = element;
    }
    if (CustomArrow) {
      dummy_custom_arrow = element;
    }

    const ajala_options: TAjalaOptions = {
      ...options,
      custom_tooltip: dummy_custom_tooltip as any,
      custom_arrow: dummy_custom_arrow as any,
    };
    const ajala_instance = new AjalaJourney(steps, ajala_options);

    /**
     * Attach necessary Event listeners
     */
    const onStartHandler = () => {
      setActiveStep(ajala_instance.getActiveStep());
    };
    const onTransitionCompleteHandler = () => {
      setActiveStep(ajala_instance.getActiveStep());
    };
    const onAfterDomInsertHandler = (event: any) => {
      setTooltipContainer(event?.data?.tooltip_container_element);
      setArrowContainer(event?.data?.arrow_element);
      element.remove();
    };
    ajala_instance.addEventListener(
      "onAfterDomInsert",
      onAfterDomInsertHandler
    );
    ajala_instance.addEventListener("onStart", onStartHandler);
    ajala_instance.addEventListener(
      "onTransitionComplete",
      onTransitionCompleteHandler
    );

    ajala_instance.init();

    if (getInstance) {
      getInstance(ajala_instance);
    }
    setAjalaInstance(ajala_instance);

    return () => {
      // clean up
      ajala_instance.removeEventListener("onStart", onStartHandler);
      ajala_instance.removeEventListener(
        "onAfterDomInsert",
        onAfterDomInsertHandler
      );
      ajala_instance.removeEventListener(
        "onTransitionComplete",
        onTransitionCompleteHandler
      );

      ajala_instance.destroy();
    };
  }, []);

  return (
    <AjalaJourneyContext.Provider value={ajalaInstance}>
      {children}

      {CustomTooltip &&
        customTooltipContainer &&
        createPortal(
          <CustomTooltip active_step={activeStep} ajala={ajalaInstance} />,
          customTooltipContainer
        )}
      {CustomArrow &&
        customArrowContainer &&
        createPortal(<CustomArrow />, customArrowContainer)}
    </AjalaJourneyContext.Provider>
  );
}

function useAjalaJourneyContext() {
  const context = useContext(AjalaJourneyContext);

  if (!context) {
    throw new Error(
      "useAjalaJourneyContext must be used within a <AjalaJourneyProvider />"
    );
  }

  return context;
}

export { AjalaJourneyProvider, useAjalaJourneyContext };
