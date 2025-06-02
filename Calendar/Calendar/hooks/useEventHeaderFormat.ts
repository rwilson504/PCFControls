import { useEffect, useState } from "react";
import { IInputs } from "../generated/ManifestTypes";

export function useEventHeaderFormat(pcfContext: ComponentFramework.Context<IInputs>) {
  const [eventHeaderFormat, setEventHeaderFormat] = useState<string>(
    pcfContext.parameters.eventHeaderFormat?.raw || "0"
  );

  useEffect(() => {
    const formatValue = pcfContext.parameters.eventHeaderFormat?.raw || "0";
    setEventHeaderFormat(formatValue);
  }, [pcfContext.parameters.eventHeaderFormat?.raw]);

  return eventHeaderFormat;
}
