import { SchedulerData, EventItem } from "react-big-schedule"; // adjust import paths as needed

export function createEventClickedCallback(
    onClickSelectedRecord: (eventId: string) => void
) {
    return (schedulerData: SchedulerData, event: EventItem) => {
        const eventId = event.id as string;
        if (eventId) {
            onClickSelectedRecord?.(eventId);
        }
    };
}
