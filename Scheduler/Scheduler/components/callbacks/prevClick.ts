import { SchedulerData } from "react-big-schedule";
import { SchedulerAction, Event} from "../../types";

export function createPrevClickCallback(
    events: Event[],
    schedulerView: string,
    dispatch: (action: SchedulerAction) => void,
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
