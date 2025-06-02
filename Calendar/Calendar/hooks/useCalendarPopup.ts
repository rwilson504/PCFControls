import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils";
import { IInputs } from "../generated/ManifestTypes";

export function useCalendarPopup(pcfContext: ComponentFramework.Context<IInputs>) {
  const [calendarPopup, setCalendarPopup] = useState<boolean>(
    pcfContext.parameters.calendarPopup?.raw?.toLowerCase() === "false"
      ? false
      : CalendarUtils.DEFAULT_POPUP
  );

  useEffect(() => {
    const popupValue =
      pcfContext.parameters.calendarPopup?.raw?.toLowerCase() === "false"
        ? false
        : CalendarUtils.DEFAULT_POPUP;
    setCalendarPopup(popupValue);
  }, [pcfContext.parameters.calendarPopup?.raw]);

  return calendarPopup;
}
