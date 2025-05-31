import * as CalendarUtils from "../utils";
import { Resource, Keys } from "../types";

interface SlotInfo {
  start: Date;
  end: Date;
  resourceId?: string;
}

interface CalendarData {
  keys?: Keys;
  resources?: Resource[];
}

export function handleSlotSelect(
  onClickSlot: (start: Date, end: Date, resourceId: string) => void,
  pcfContext: any,
  calendarData: CalendarData
) {
  return (slotInfo: SlotInfo) => {
    onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");

    if (pcfContext.mode.allocatedHeight === -1) {
      const newRecordProperties: any = {};

      if (calendarData.keys?.start) {
        newRecordProperties[calendarData.keys.start] =
          CalendarUtils.formatDateAsParameterString(slotInfo.start);
      }
      if (calendarData.keys?.end) {
        newRecordProperties[calendarData.keys.end] =
          CalendarUtils.formatDateAsParameterString(slotInfo.end);
      }

      if (
        calendarData.keys?.resource &&
        slotInfo.resourceId &&
        Array.isArray(calendarData.resources)
      ) {
        const resourceInfo = calendarData.resources.find(
          (x) => x.id === slotInfo.resourceId
        );
        if (resourceInfo) {
          newRecordProperties[calendarData.keys.resource] = resourceInfo.id;
          if (calendarData.keys.resource + "name" in resourceInfo) {
            newRecordProperties[calendarData.keys.resource + "name"] =
              resourceInfo.title;
          }
          if (calendarData.keys.resource + "type" in resourceInfo) {
            newRecordProperties[calendarData.keys.resource + "type"] =
              resourceInfo.etn;
          }
        }
      }

      pcfContext.navigation.openForm(
        {
          entityName:
            pcfContext.parameters.calendarDataSet.getTargetEntityType() || "",
          openInNewWindow: false,
        },
        newRecordProperties
      );
    }
  };
}
