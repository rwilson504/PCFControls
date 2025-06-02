import * as moment from "moment";

export function handleNavigate(
  setCalendarDate: (date: Date) => void,
  setCalendarView?: (view: string) => void
) {
  return (date: Date, view: string, action: string) => {
    setCalendarDate(moment(date).toDate());
    if (setCalendarView && view) {
      setCalendarView(view);
    }
  };
}
