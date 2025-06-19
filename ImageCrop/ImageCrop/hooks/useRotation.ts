import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the image rotation property from PCF context and update when it changes.
 * @param context The PCF context object
 * @returns The current rotation value (number, degrees)
 */
export function useRotation(context: ComponentFramework.Context<IInputs>): number {
  const getRotation = () => {
    const raw = context.parameters.rotation?.raw;
    if (raw === undefined || raw === null || (typeof raw === "string" && raw === "")) return 0;
    const num = Number(raw);
    return isNaN(num) ? 0 : num;
  };

  const [rotation, setRotation] = useState<number>(getRotation());

  useEffect(() => {
    setRotation(getRotation());
  }, [context.parameters.rotation?.raw]);

  return rotation;
}
