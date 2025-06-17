import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Custom hook to track the ruleOfThirds property from PCF context and update when it changes.
 * For TwoOptions, the value will be boolean or undefined.
 * @param context The PCF context object
 * @returns The current ruleOfThirds value (boolean)
 */
export function useRuleOfThirds(context: ComponentFramework.Context<IInputs>): boolean {
  const getRuleOfThirds = () => {
    const raw = context.parameters.ruleOfThirds?.raw;
    return raw === true;
  };

  const [ruleOfThirds, setRuleOfThirds] = useState<boolean>(getRuleOfThirds());

  useEffect(() => {
    setRuleOfThirds(getRuleOfThirds());
  }, [context.parameters.ruleOfThirds?.raw]);

  return ruleOfThirds;
}
