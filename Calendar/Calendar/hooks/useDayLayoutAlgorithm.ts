import { useEffect, useState } from "react";
import { DayLayoutAlgorithm } from "react-big-calendar";
import * as CalendarUtils from "../utils";

export function useDayLayoutAlgorithm(pcfContext: any) {
  const [dayLayoutAlgorithm, setDayLayoutAlgorithm] = useState<DayLayoutAlgorithm>(
    (pcfContext.parameters.dayLayoutAlgorithm?.raw as DayLayoutAlgorithm) || CalendarUtils.DEFAULT_LAYOUT_ALGORITHM
  );

  useEffect(() => {
    const algorithm =
      (pcfContext.parameters.dayLayoutAlgorithm?.raw as DayLayoutAlgorithm) || CalendarUtils.DEFAULT_LAYOUT_ALGORITHM;
    setDayLayoutAlgorithm(algorithm);
  }, [pcfContext.parameters.dayLayoutAlgorithm?.raw]);

  return dayLayoutAlgorithm;
}
