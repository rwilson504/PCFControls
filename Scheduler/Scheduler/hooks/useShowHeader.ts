import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";

export function useShowHeader(
    pcfContext: any,
    state: { schedulerData: SchedulerData | null },
    dispatch: (action: any) => void
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
    }, [showHeader, state.schedulerData, dispatch]);

    return showHeader;
}