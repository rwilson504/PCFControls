import { useState, useEffect } from "react";
import { getCalendarView } from "../utils/CalendarHelpers";

export function useCalendarView(calendarViews: any, calendarViewRaw: string) {
  const [calendarView, setCalendarView] = useState(
    getCalendarView(calendarViews, calendarViewRaw || "")
  );

  useEffect(() => {
    if (
      calendarViewRaw &&
      calendarView !== calendarViewRaw
    ) {
      setCalendarView(getCalendarView(calendarViews, calendarViewRaw));
    }
    // Only update from prop if prop changes and is different from state
    // This allows view changes from the calendar header to work without being overwritten by the prop
  }, [calendarViewRaw]);

  return [calendarView, setCalendarView] as const;
}
