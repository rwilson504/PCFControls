import { SchedulerData } from "react-big-schedule";

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
        item: any
    ) => {
        if (onNewEvent) {
            onNewEvent(
                slotId,
                start as Date,
                end as Date
            );
        }
    };
}
