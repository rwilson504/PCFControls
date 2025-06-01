import { useEffect, useState, useMemo } from "react";
import * as CalendarUtils from "../utils";
import { IInputs } from "../generated/ManifestTypes";

export function useCalendarHourRange(pcfContext: ComponentFramework.Context<IInputs>, momentInstance: typeof import("moment")) {
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

  const min = useMemo(
    () => momentInstance(`${minHour}:00`, "HH:mm").toDate(),
    [minHour, momentInstance]
  );
  const max = useMemo(
    () => momentInstance(`${maxHour}:59:59`, "HH:mm:ss").toDate(),
    [maxHour, momentInstance]
  );

  return { min, max };
}