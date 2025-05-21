import { useState, useEffect } from "react";
import { getViewByName } from "../types/schedulerViews";
import { SchedulerData } from "react-big-schedule";
import { Event } from "../types/schedulerTypes";

export function useSchedulerView(
    pcfContext: any,
    availableViews: any[],
    state: { schedulerData: SchedulerData | null },
    events: Event[],
    dispatch: (action: any) => void,
    onDateChange?: (
        date: Date,
        viewStart: Date,
        viewEnd: Date,
        viewName: string
    ) => void
): [string, (viewName: string) => void] {
    const [schedulerView, setSchedulerView] = useState<string>(() => {
        const raw = pcfContext.context.parameters.schedulerView?.raw as string | undefined;
        const initialView = availableViews.find(v => v.name.toLowerCase() === raw?.trim().toLowerCase());
        return initialView?.name ?? availableViews[0]?.name ?? "";
    });

    // Sync schedulerView with parameter and availableViews
    useEffect(() => {
        const raw = pcfContext.context.parameters.schedulerView?.raw as string | undefined;
        let newViewName = availableViews[0]?.name ?? "";
        if (raw) {
            const newView = availableViews.find(v => v.name.toLowerCase() === raw.trim().toLowerCase());
            if (newView) {
                newViewName = newView.name;
            }
        }
        if (schedulerView !== newViewName) {
            setSchedulerView(newViewName);
        }
    }, [pcfContext.context.parameters.schedulerView?.raw]);

    // Update SchedulerData and call onDateChange when schedulerView changes
    useEffect(() => {
        if (state.schedulerData) {
            const currentView = getViewByName(availableViews, schedulerView);
            const currentViewObj = currentView ?? availableViews[0];

            if (onDateChange) {
                onDateChange(
                    state.schedulerData.getViewStartDate().toDate(),
                    state.schedulerData.getViewStartDate().toDate(),
                    state.schedulerData.getViewEndDate().toDate(),
                    schedulerView
                );
            }

            state.schedulerData.setViewType(
                currentViewObj?.viewType,
                currentViewObj?.showAgenda ?? false,
                currentViewObj?.isEventPerspective ?? false
            );
            state.schedulerData.setEvents(events);
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
    }, [schedulerView]);

    return [schedulerView, setSchedulerView];
}