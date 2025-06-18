import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the maxWidth property from PCF context and update when it or scaling changes.
 * @param context The PCF context object
 * @returns The current scaled maxWidth value (number | undefined)
 */
export function useMaxWidth(context: ComponentFramework.Context<IInputs>): number | undefined {
  const getMaxWidth = () => {
    const raw = context.parameters.maxWidth?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return undefined;
    const num = Number(raw);
    if (isNaN(num) || num === -1) return undefined;
    return num;
  };

  const [maxWidth, setMaxWidth] = useState<number | undefined>(getMaxWidth());

  useEffect(() => {
    setMaxWidth(getMaxWidth());
  }, [context.parameters.maxWidth?.raw]);

  return maxWidth;
}
