import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils";
import { IInputs } from "../generated/ManifestTypes";

export function useCalendarSelectable(pcfContext: ComponentFramework.Context<IInputs>) {
  const [calendarSelectable, setCalendarSelectable] = useState<boolean>(
    pcfContext.parameters.calendarSelectable?.raw?.toLowerCase() === "false"
      ? false
      : CalendarUtils.DEFAULT_SELECTABLE
  );

  useEffect(() => {
    const selectableValue =
      pcfContext.parameters.calendarSelectable?.raw?.toLowerCase() === "false"
        ? false
        : CalendarUtils.DEFAULT_SELECTABLE;
    setCalendarSelectable(selectableValue);
  }, [pcfContext.parameters.calendarSelectable?.raw]);

  return calendarSelectable;
}
