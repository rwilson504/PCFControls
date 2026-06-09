import { useState, useEffect } from "react";
import { SCHEDULER_VIEWS } from "../types/schedulerViews";
import { getLocalizedViewName } from "../utils/localization";
import { DEFAULT_VIEW_NAMES } from "../utils/constants";
import { SchedulerData } from "react-big-schedule";
import { PcfContextService } from "pcf-context-service";
import { SchedulerAction } from "../types";

export function useAvailableViews(
    pcfContext: PcfContextService,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: SchedulerAction) => void
) {
    const getViews = () => {
        const raw = pcfContext.context.parameters.schedulerAvailableViews?.raw as string | undefined;
        const allowed = raw && raw.trim().length > 0
            ? raw.split(",").map(v => v.trim().toLowerCase())
            : DEFAULT_VIEW_NAMES;
        const lang = state.schedulerData?.localeDayjs().locale() || "en";
        return SCHEDULER_VIEWS
            .filter(view => allowed.includes(view.name.toLowerCase()))
            .map(view => ({
                ...view,
                viewName: getLocalizedViewName(lang, view.viewName) // <-- overwrite viewName with localized value
            }));
    };

    const [availableViews, setAvailableViews] = useState(getViews);

    useEffect(() => {
        setAvailableViews(getViews());
    }, [
        pcfContext.context.parameters.schedulerAvailableViews?.raw,
        state.schedulerData?.localeDayjs().locale()
    ]);

    useEffect(() => {
        if (state.schedulerData) {
            state.schedulerData.config.views = availableViews;
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
    }, [availableViews]);

    return availableViews;
}