import { SchedulerData, EventItem } from "react-big-schedule";

export function createNewEventCallback(
    onNewEvent: (slotId: string, start: Date, end: Date) => void
) {
    return (
        schedulerData: SchedulerData,
        slotId: string,
        slotName: string,
        start: string | Date,
        end: string | Date,
        type: string,
        item: EventItem
    ) => {
        let startDate = start;
        let endDate = end;
        if (typeof start === "string") {
            startDate = new Date(start);
        }
        if (typeof end === "string") {
            endDate = new Date(end);
        }
        if (onNewEvent) {
            onNewEvent(
                slotId,
                startDate as Date,
                endDate as Date
            );
        }
    };
}
