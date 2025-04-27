"use client";
import { useEffect, useState } from "react";
import { AjalaJourney, TAjalaSteps, TAjalaOptions } from "ajala.js";

interface PropTypes extends TAjalaOptions {
  steps: TAjalaSteps[];
}

export function useAjalaJourney({ steps, ...options }: PropTypes) {
  const [ajalaInstance, setAjalaInstance] = useState<AjalaJourney | null>(null);
  useEffect(() => {
    const ajala_instance = new AjalaJourney(steps, options);

    ajala_instance.init();

    setAjalaInstance(ajala_instance);

    return () => {
      ajala_instance.destroy();
    };
  }, [steps, options]);
  return ajalaInstance;
}
