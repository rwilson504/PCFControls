import { SchedulerData } from "react-big-schedule";
import { SchedulerAction } from "../../types";

export function createToggleExpandFuncCallback(
    dispatch: (action: SchedulerAction) => void
) {
    return (schedulerData: SchedulerData, slotId: string) => {
        schedulerData.toggleExpandStatus(slotId);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    };
}
