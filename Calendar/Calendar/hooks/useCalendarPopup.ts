import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils";

export function useCalendarPopup(pcfContext: any) {
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
