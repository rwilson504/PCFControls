import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the disabled property from PCF context and update when it changes.
 * For TwoOptions, the value will be boolean or undefined.
 * @param context The PCF context object
 * @returns The current disabled value (boolean)
 */
export function useDisabled(context: ComponentFramework.Context<IInputs>): boolean {
  const getDisabled = () => {
    const raw = context.parameters.disabled?.raw;
    return raw === true;
  };

  const [disabled, setDisabled] = useState<boolean>(getDisabled());

  useEffect(() => {
    setDisabled(getDisabled());
  }, [context.parameters.disabled?.raw]);

  return disabled;
}
