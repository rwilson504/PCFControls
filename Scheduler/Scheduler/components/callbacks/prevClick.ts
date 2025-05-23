import { SchedulerData } from "react-big-schedule";

export function createPrevClickCallback(
    events: any[],
    schedulerView: string,
    dispatch: (action: any) => void,
    onDateChange: (start: Date, viewStart: Date, viewEnd: Date, view: string) => void
) {
    return (schedulerData: SchedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
        onDateChange?.(
            schedulerData.getViewStartDate().toDate(),
            schedulerData.getViewStartDate().toDate(),
            schedulerData.getViewEndDate().toDate(),
            schedulerView
        );
    };
}
