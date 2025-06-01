import { useEffect, useState } from "react";
import { Moment } from "moment";

export function useCalendarDate(pcfContext: any, momentInstance: (input?: any) => Moment) {
  const [calendarDate, setCalendarDate] = useState(
    pcfContext.parameters.calendarDate?.raw?.getTime() === 0
      ? momentInstance().toDate()
      : pcfContext.parameters.calendarDate?.raw || momentInstance().toDate()
  );

  useEffect(() => {
    if (
      pcfContext.parameters.calendarDate?.raw?.getTime() !== 0 &&
      !momentInstance(calendarDate).isSame(pcfContext.parameters.calendarDate.raw)
    ) {
      setCalendarDate(pcfContext.parameters.calendarDate.raw as Date);
    }
    // Only update from prop if prop changes and is different from state
    // This allows navigation to work without being overwritten by the prop
  }, [pcfContext.parameters.calendarDate?.raw?.getTime()]);

  return [calendarDate, setCalendarDate] as const;
}
