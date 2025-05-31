import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils";

export function useCalendarHourRange(pcfContext: any) {
  const [minHour, setMinHour] = useState<number>(
    pcfContext.parameters.calendarMinHour?.raw ?? CalendarUtils.DEFAULT_MIN_HOUR
  );
  const [maxHour, setMaxHour] = useState<number>(
    pcfContext.parameters.calendarMaxHour?.raw ?? CalendarUtils.DEFAULT_MAX_HOUR
  );

  useEffect(() => {
    const newMinHour =
      pcfContext.parameters.calendarMinHour?.raw ?? CalendarUtils.DEFAULT_MIN_HOUR;
    const newMaxHour =
      pcfContext.parameters.calendarMaxHour?.raw ?? CalendarUtils.DEFAULT_MAX_HOUR;

    setMinHour(newMinHour);
    setMaxHour(newMaxHour);
  }, [
    pcfContext.parameters.calendarMinHour?.raw,
    pcfContext.parameters.calendarMaxHour?.raw,
  ]);

  return { minHour, maxHour };
}