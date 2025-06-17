import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the circularCrop property from PCF context and update when it changes.
 * For TwoOptions, the value will be boolean or undefined.
 * @param context The PCF context object
 * @returns The current circularCrop value (boolean)
 */
export function useCircularCrop(context: ComponentFramework.Context<IInputs>): boolean {
  const getCircularCrop = () => {
    const raw = context.parameters.circularCrop?.raw;
    return raw === true;
  };

  const [circularCrop, setCircularCrop] = useState<boolean>(getCircularCrop());

  useEffect(() => {
    setCircularCrop(getCircularCrop());
  }, [context.parameters.circularCrop?.raw]);

  return circularCrop;
}
