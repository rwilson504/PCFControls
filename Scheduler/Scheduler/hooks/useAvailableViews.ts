import { useState, useEffect } from "react";
import { SCHEDULER_VIEWS } from "../types/schedulerViews";
import { DEFAULT_VIEW_NAMES } from "../utils/constants";
import { SchedulerData } from "react-big-schedule";

export function useAvailableViews(
    pcfContext: any,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: any) => void
) {
    const [availableViews, setAvailableViews] = useState(() => {
        const raw = pcfContext.context.parameters.schedulerAvailableViews?.raw as string | undefined;
        const allowed = raw && raw.trim().length > 0
            ? raw.split(",").map(v => v.trim().toLowerCase())
            : DEFAULT_VIEW_NAMES;
        return SCHEDULER_VIEWS.filter(view => allowed.includes(view.name.toLowerCase()));
    });

    useEffect(() => {
        const raw = pcfContext.context.parameters.schedulerAvailableViews?.raw as string | undefined;
        const allowed = raw && raw.trim().length > 0
            ? raw.split(",").map(v => v.trim().toLowerCase())
            : DEFAULT_VIEW_NAMES;
        setAvailableViews(SCHEDULER_VIEWS.filter(view => allowed.includes(view.name.toLowerCase())));
    }, [pcfContext.context.parameters.schedulerAvailableViews?.raw]);

    useEffect(() => {
        if (state.schedulerData) {
            state.schedulerData.config.views = availableViews;
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
    }, [availableViews, state.schedulerData, dispatch]);

    return availableViews;
}