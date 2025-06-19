import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the keepSelection property from PCF context and update when it changes.
 * For TwoOptions, the value will be boolean or undefined.
 * @param context The PCF context object
 * @returns The current keepSelection value (boolean)
 */
export function useKeepSelection(context: ComponentFramework.Context<IInputs>): boolean {
  const getKeepSelection = () => {
    const raw = context.parameters.keepSelection?.raw;
    return raw === true;
  };

  const [keepSelection, setKeepSelection] = useState<boolean>(getKeepSelection());

  useEffect(() => {
    setKeepSelection(getKeepSelection());
  }, [context.parameters.keepSelection?.raw]);

  return keepSelection;
}
