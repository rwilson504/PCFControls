import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the minWidth property from PCF context and update when it or scaling changes.
 * @param context The PCF context object
 * @returns The current scaled minWidth value (number | undefined)
 */
export function useMinWidth(context: ComponentFramework.Context<IInputs>): number | undefined {
  const getMinWidth = () => {
    const raw = context.parameters.minWidth?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return undefined;
    const num = Number(raw);
    if (isNaN(num) || num === -1) return undefined;
    return num;
  };

  const [minWidth, setMinWidth] = useState<number | undefined>(getMinWidth());

  useEffect(() => {
    setMinWidth(getMinWidth());
  }, [context.parameters.minWidth?.raw])
  return minWidth;
}
