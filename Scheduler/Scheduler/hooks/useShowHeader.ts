import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";
import { PcfContextService } from "../services/pcfContextService";
import { SchedulerAction } from "../types";

export function useShowHeader(
    pcfContext: PcfContextService,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: SchedulerAction) => void
): boolean {
    const [showHeader, setShowHeader] = useState<boolean>(
        pcfContext.context.parameters.showSchedulerHeader?.raw !== false
    );

    // Sync showHeader with parameter changes
    useEffect(() => {
        setShowHeader(pcfContext.context.parameters.showSchedulerHeader?.raw !== false);
    }, [pcfContext.context.parameters.showSchedulerHeader?.raw]);

    // Update SchedulerData and dispatch when showHeader changes
    useEffect(() => {
        if (state.schedulerData) {
            state.schedulerData.config.headerEnabled = showHeader;
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
    }, [showHeader]);

    return showHeader;
}