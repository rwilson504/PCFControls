import { useState, useEffect } from "react";
import { Resource, Keys, IEvent } from "../types";
import * as CalendarUtils from "../utils";

export function useCalendarData(pcfContext: any) {
  const [calendarData, setCalendarData] = useState<{
    resources: Resource[] | undefined;
    events: IEvent[];
    keys: Keys | undefined;
  }>({ resources: [], events: [], keys: undefined });

  useEffect(() => {
    async function asyncCalendarData() {
      let keys = calendarData.keys;
      if (!keys) {
        keys = await CalendarUtils.getKeys(pcfContext);
      }

      const dataSet = pcfContext.parameters.calendarDataSet;
      if (dataSet.loading === false) {
        const calendarDataResult = await CalendarUtils.getCalendarData(
          pcfContext,
          keys
        );

        setCalendarData({
          resources:
            calendarDataResult.resources &&
            calendarDataResult.resources.length > 0
              ? calendarDataResult.resources
              : undefined,
          events: calendarDataResult.events || [],
          keys: calendarDataResult.keys || undefined,
        });
      }
    }
    asyncCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pcfContext.parameters.calendarDataSet.records]);

  return [calendarData, setCalendarData] as const;
}
