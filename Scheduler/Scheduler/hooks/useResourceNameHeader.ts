import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";
import { getLocalizedResourceName } from "../utils/localization";

export function useResourceNameHeader(
    pcfContext: any,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: any) => void
): string {
    const getHeader = () => {
        const param = pcfContext.context.parameters.resourceNameHeader?.raw?.trim();
        if (param) return param;
        const lang = state.schedulerData?.localeDayjs().locale() || "en";
        return getLocalizedResourceName(lang);
    };

    const [resourceNameHeader, setResourceNameHeader] = useState(getHeader);

    useEffect(() => {
        setResourceNameHeader(getHeader());
    }, [
        pcfContext.context.parameters.resourceNameHeader?.raw,
        state.schedulerData?.localeDayjs().locale()
    ]);

    useEffect(() => {
        if (state.schedulerData) {
            state.schedulerData.config.resourceName = resourceNameHeader;
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
    }, [resourceNameHeader]);

    return resourceNameHeader;
}