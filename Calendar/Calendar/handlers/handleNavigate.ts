import * as moment from "moment";

export function handleNavigate(setCalendarDate: (date: Date) => void) {
  return (date: Date, view: string, action: string) => {
    setCalendarDate(moment(date).toDate());
  };
}
