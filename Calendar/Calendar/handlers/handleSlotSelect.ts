import * as CalendarUtils from "../utils";
import { Resource, Keys } from "../types";
import { SlotInfo as RBCSlotInfo } from "react-big-calendar";
import { IInputs } from "../generated/ManifestTypes";

// Accepts the normalized SlotInfo with resourceId as string | undefined
export interface SlotInfo extends Omit<RBCSlotInfo, "resourceId"> {
    resourceId?: string;
}

interface CalendarData {
    keys?: Keys;
    resources?: Resource[];
}

export function handleSlotSelect(
    onClickSlot: (start: Date, end: Date, resourceId: string) => void,
    pcfContext: ComponentFramework.Context<IInputs>,
    calendarData: CalendarData
) {
    return (slotInfo: SlotInfo) => {
        // slotInfo.resourceId is always string | undefined here
        onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");

        if (pcfContext.mode.allocatedHeight === -1) {
            const newRecordProperties: { [key: string]: string } = {};

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
                            resourceInfo.etn as string;
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
