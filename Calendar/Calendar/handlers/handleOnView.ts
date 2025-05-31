import * as CalendarUtils from "../utils";

export function handleOnView(setCalendarView: (view: any) => void, calendarViews: any) {
  return (view: string) => {
    setCalendarView(CalendarUtils.getCalendarView(calendarViews, view));
  };
}
