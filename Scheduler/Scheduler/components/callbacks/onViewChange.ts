import { SchedulerData, View } from "react-big-schedule";

export function createOnViewChangeCallback(
    availableViews: any[],
    setSchedulerView: (viewName: string) => void
) {
    return (schedulerData: SchedulerData, view: View) => {
        const foundView = availableViews.find(v => v.viewType === view.viewType);
        if (foundView) {
            setSchedulerView(foundView.name);
        }
    };
}
