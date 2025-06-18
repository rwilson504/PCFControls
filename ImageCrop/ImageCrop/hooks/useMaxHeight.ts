import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the maxHeight property from PCF context and update when it or scaling changes.
 * @param context The PCF context object
 * @returns The current scaled maxHeight value (number | undefined)
 */

export function useMaxHeight(context: ComponentFramework.Context<IInputs>): number | undefined {
  const getMaxHeight = () => {
    const raw = context.parameters.maxHeight?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return undefined;
    const num = Number(raw);
    if (isNaN(num) || num === -1) return undefined;
    return num;
  };

  const [maxHeight, setMaxHeight] = useState<number | undefined>(getMaxHeight());

  useEffect(() => {
    setMaxHeight(getMaxHeight());
  }, [context.parameters.maxHeight?.raw])

  return maxHeight;
}
