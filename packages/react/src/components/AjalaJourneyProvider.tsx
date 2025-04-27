"use client";
import { AjalaJourney, TAjalaSteps, TAjalaOptions } from "ajala.js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AjalaJourneyContext = createContext<AjalaJourney | null>(null);

interface PropTypes extends TAjalaOptions {
  steps: TAjalaSteps[];
  children: ReactNode;
  getInstance?: (value: AjalaJourney) => void;
}

function AjalaJourneyProvider({
  children,
  getInstance,
  steps,
  ...options
}: PropTypes) {
  const [ajalaInstance, setAjalaInstance] = useState<AjalaJourney | null>(null);

  useEffect(() => {
    const ajala_instance = new AjalaJourney(steps, options);

    ajala_instance.init();

    setAjalaInstance(ajala_instance);

    if (getInstance) {
      getInstance(ajala_instance);
    }

    return () => {
      ajala_instance.destroy();
    };
  }, [steps, options]);

  return (
    <AjalaJourneyContext.Provider value={ajalaInstance}>
      {children}
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
