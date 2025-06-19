import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the image scaling property from PCF context and update when it changes.
 * @param context The PCF context object
 * @returns The current scaling value (number, default 1)
 */
export function useScaling(context: ComponentFramework.Context<IInputs>): number {
  const getScaling = () => {
    const raw = context.parameters.scaling?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return 1;
    const num = Number(raw);
    return isNaN(num) ? 1 : num;
  };

  const [scaling, setScaling] = useState<number>(getScaling());

  useEffect(() => {
    setScaling(getScaling());
  }, [context.parameters.scaling?.raw]);

  return scaling;
}
