import { SchedulerData } from "react-big-schedule";
import { View } from "../../types";

export function createOnViewChangeCallback(
    availableViews: View[],
    setSchedulerView: (viewName: string) => void
) {
    return (schedulerData: SchedulerData, view: View) => {
        const foundView = availableViews.find(v => v.viewType === view.viewType);
        if (foundView) {
            setSchedulerView(foundView.name);
        }
    };
}
