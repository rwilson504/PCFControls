import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils/Constants";

export function useEventSelectable(pcfContext: any) {
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
