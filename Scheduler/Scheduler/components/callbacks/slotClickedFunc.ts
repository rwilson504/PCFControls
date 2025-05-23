import { SchedulerData, EventItem, ResourceEvent } from "react-big-schedule";
import { Slot } from "../../types";

export function createSlotClickedFuncCallback(
    onClickSelectedSlot: (resourceId: string) => void
) {
    return (schedulerData: SchedulerData, slot: ResourceEvent<EventItem>) => {
        const slotExtended = slot as Slot
        if (slotExtended && slotExtended.slotId) {
            const resourceId = slotExtended.slotId;
            onClickSelectedSlot(resourceId);
        }
    };
}
