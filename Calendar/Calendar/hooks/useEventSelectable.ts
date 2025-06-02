import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils/Constants";
import { IInputs } from "../generated/ManifestTypes";

export function useEventSelectable(pcfContext: ComponentFramework.Context<IInputs>) {
  const [isEventSelectable, setIsEventSelectable] = useState<boolean>(
    pcfContext.parameters.eventSelectable?.raw?.toLowerCase() === "false"
      ? false
      : CalendarUtils.DEFAULT_EVENT_SELECTABLE
  );

  useEffect(() => {
    const selectableValue =
      pcfContext.parameters.eventSelectable?.raw?.toLowerCase() === "false"
        ? false
        : CalendarUtils.DEFAULT_EVENT_SELECTABLE;
    setIsEventSelectable(selectableValue);
  }, [pcfContext.parameters.eventSelectable?.raw]);

  return isEventSelectable;
}
