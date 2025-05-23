import { SchedulerData } from "react-big-schedule";

export function createToggleExpandFuncCallback(
    dispatch: (action: any) => void
) {
    return (schedulerData: SchedulerData, slotId: string) => {
        schedulerData.toggleExpandStatus(slotId);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    };
}
