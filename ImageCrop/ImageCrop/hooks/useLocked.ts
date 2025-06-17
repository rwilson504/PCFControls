import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the locked property from PCF context and update when it changes.
 * For TwoOptions, the value will be boolean or undefined.
 * @param context The PCF context object
 * @returns The current locked value (boolean)
 */
export function useLocked(context: ComponentFramework.Context<IInputs>): boolean {
  const getLocked = () => {
    const raw = context.parameters.locked?.raw;
    return raw === true;
  };

  const [locked, setLocked] = useState<boolean>(getLocked());

  useEffect(() => {
    setLocked(getLocked());
  }, [context.parameters.locked?.raw]);

  return locked;
}
