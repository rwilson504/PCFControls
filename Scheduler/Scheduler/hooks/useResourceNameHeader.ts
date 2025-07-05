import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";
import { getLocalizedResourceName } from "../utils/localization";
import { PcfContextService } from "pcf-context-service";
import { SchedulerAction } from "../types";

export function useResourceNameHeader(
    pcfContext: PcfContextService,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: SchedulerAction) => void
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