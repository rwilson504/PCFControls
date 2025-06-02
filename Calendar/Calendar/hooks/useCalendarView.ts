import { useState, useEffect } from "react";
import { getCalendarView } from "../utils/CalendarHelpers";
import { View, ViewProps } from "react-big-calendar";
import { Resource } from "../types";

export function useCalendarView(calendarViews: View[], calendarViewRaw: string) {
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
