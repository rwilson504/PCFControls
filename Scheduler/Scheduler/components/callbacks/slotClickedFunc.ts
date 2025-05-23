import { SchedulerData, EventItem, ResourceEvent } from "react-big-schedule";

export function createSlotClickedFuncCallback(
    onClickSelectedSlot?: (resourceId: string) => void
) {
    return (schedulerData: SchedulerData, slot: ResourceEvent<EventItem>) => {
        if (slot && slot.id) {
            const resourceId = slot.id.toString();
            onClickSelectedSlot?.(resourceId);
        }
    };
}
