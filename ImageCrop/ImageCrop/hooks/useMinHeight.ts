import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the minHeight property from PCF context and update when it or scaling changes.
 * @param context The PCF context object
 * @param scaling The browser scaling factor to apply
 * @returns The current scaled minHeight value (number | undefined)
 */

export function useMinHeight(context: ComponentFramework.Context<IInputs>, scaling = 1): number | undefined {
  const getMinHeight = () => {
    const raw = context.parameters.minHeight?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return undefined;
    const num = Number(raw);
    if (isNaN(num) || num === -1) return undefined;
    return num * scaling;
  };

  const [minHeight, setMinHeight] = useState<number | undefined>(getMinHeight());

  useEffect(() => {
    setMinHeight(getMinHeight());
  }, [context.parameters.minHeight?.raw, scaling]);

  return minHeight;
}