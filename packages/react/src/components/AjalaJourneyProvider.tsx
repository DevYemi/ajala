"use client";
import { AjalaJourney, TAjalaOptions, TSteps } from "ajala.js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  ...callbackFuncs
}: TReactAjalaProviderProps) {
  const [ajalaInstance, setAjalaInstance] = useState<AjalaJourney | null>(
    {} as any
  );
  const [activeStep, setActiveStep] = useState<TSteps>();
  const [customTooltipContainer, setTooltipContainer] =
    useState<HTMLElement | null>(null);
  const [customArrowContainer, setArrowContainer] =
    useState<HTMLElement | null>(null);

  const placeholder_element = useRef<HTMLElement | null>(null);

  useEffect(() => {
    /**
     * Create a dummy tooltip and arrow and pass it to ajala if a CustomTooltip or CustomArrow component was passed.
     * This is needed to prevent ajala from creating it's default so we can inject our custom react tooltip and arrow.
     */
    let dummy_custom_tooltip = null;
    let dummy_custom_arrow = null;
    placeholder_element.current = document.createElement("div");
    if (CustomTooltip) {
      dummy_custom_tooltip = placeholder_element.current;
    }
    if (CustomArrow) {
      dummy_custom_arrow = placeholder_element.current;
    }

    const ajala_options: TAjalaOptions = {
      ...options,
      custom_tooltip: dummy_custom_tooltip as any,
      custom_arrow: dummy_custom_arrow as any,
    };
    const ajala_instance = new AjalaJourney(steps, ajala_options);

    ajala_instance.init();

    if (getInstance) {
      getInstance(ajala_instance);
    }
    setAjalaInstance(ajala_instance);

    return () => {
      // clean up
      ajala_instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ajalaInstance?.initialized) return;

    /**
     * Attach necessary Event listeners
     */
    const onStartHandler = () => {
      setActiveStep(ajalaInstance.getActiveStep());
    };
    const onTransitionCompleteHandler = () => {
      setActiveStep(ajalaInstance.getActiveStep());
    };
    const onAfterDomInsertHandler = (event: any) => {
      setTooltipContainer(event?.data?.tooltip_container_element);
      setArrowContainer(event?.data?.arrow_element);
      placeholder_element.current?.remove();
    };
    ajalaInstance.addEventListener("onAfterDomInsert", onAfterDomInsertHandler);
    ajalaInstance.addEventListener("onStart", onStartHandler);
    ajalaInstance.addEventListener(
      "onTransitionComplete",
      onTransitionCompleteHandler
    );
    if (callbackFuncs?.onStart) {
      ajalaInstance.addEventListener("onStart", callbackFuncs.onStart);
    }
    if (callbackFuncs?.onFinish) {
      ajalaInstance.addEventListener("onFinish", callbackFuncs.onFinish);
    }

    if (callbackFuncs?.onClose) {
      ajalaInstance.addEventListener("onClose", callbackFuncs.onClose);
    }
    if (callbackFuncs?.onNext) {
      ajalaInstance.addEventListener("onNext", callbackFuncs.onNext);
    }
    if (callbackFuncs?.onPrev) {
      ajalaInstance.addEventListener("onPrev", callbackFuncs.onPrev);
    }
    if (callbackFuncs?.onTransitionComplete) {
      ajalaInstance.addEventListener(
        "onTransitionComplete",
        callbackFuncs.onTransitionComplete
      );
    }

    return () => {
      // cleanup
      if (!ajalaInstance?.initialized) return;

      ajalaInstance.removeEventListener("onStart", onStartHandler);
      ajalaInstance.removeEventListener(
        "onAfterDomInsert",
        onAfterDomInsertHandler
      );
      ajalaInstance.removeEventListener(
        "onTransitionComplete",
        onTransitionCompleteHandler
      );
      if (callbackFuncs?.onStart) {
        ajalaInstance.removeEventListener("onStart", callbackFuncs.onStart);
      }
      if (callbackFuncs?.onFinish) {
        ajalaInstance.removeEventListener("onFinish", callbackFuncs.onFinish);
      }
      if (callbackFuncs?.onClose) {
        ajalaInstance.removeEventListener("onClose", callbackFuncs.onClose);
      }
      if (callbackFuncs?.onNext) {
        ajalaInstance.removeEventListener("onNext", callbackFuncs.onNext);
      }
      if (callbackFuncs?.onPrev) {
        ajalaInstance.removeEventListener("onPrev", callbackFuncs.onPrev);
      }
      if (callbackFuncs?.onTransitionComplete) {
        ajalaInstance.removeEventListener(
          "onTransitionComplete",
          callbackFuncs.onTransitionComplete
        );
      }
    };
  }, [
    ajalaInstance,
    callbackFuncs?.onClose,
    callbackFuncs?.onFinish,
    callbackFuncs?.onNext,
    callbackFuncs?.onPrev,
    callbackFuncs?.onStart,
    callbackFuncs?.onTransitionComplete,
  ]);

  useEffect(() => {
    // Update ajala options and step when prop changes
    if (ajalaInstance?.initialized) {
      delete (options as TAjalaOptions)?.custom_tooltip;
      delete (options as TAjalaOptions)?.custom_arrow;

      ajalaInstance.updateOptions(options, false);
      ajalaInstance.updateSteps(steps, false);
    }
  }, [options, steps, ajalaInstance]);

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
