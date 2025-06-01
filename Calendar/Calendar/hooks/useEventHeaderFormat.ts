import { useEffect, useState } from "react";

export function useEventHeaderFormat(pcfContext: any) {
  const [eventHeaderFormat, setEventHeaderFormat] = useState<string>(
    pcfContext.parameters.eventHeaderFormat?.raw || "0"
  );

  useEffect(() => {
    const formatValue = pcfContext.parameters.eventHeaderFormat?.raw || "0";
    setEventHeaderFormat(formatValue);
  }, [pcfContext.parameters.eventHeaderFormat?.raw]);

  return eventHeaderFormat;
}
