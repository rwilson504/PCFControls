import { useEffect, useState } from "react";
import { SchedulerData } from "react-big-schedule";
import { PcfContextService } from "../services/pcfContextService";
import { SchedulerAction } from "../types";

/**
 * Hook to get the value of the schedulerDisplayWeekend property from PCF context.
 * Returns true if weekends should be displayed, false otherwise.
 * Defaults to true if the property is not set.
 */
export function useDisplayWeekend(
    pcfContext: PcfContextService,
    schedulerData: SchedulerData | null,
    dispatch: (action: SchedulerAction) => void
): boolean {
    const getValue = () => {
        return pcfContext.context.parameters?.schedulerDisplayWeekend?.raw || true;
    };

    const [displayWeekend, setDisplayWeekend] = useState<boolean>(getValue);

    useEffect(() => {
        setDisplayWeekend(getValue());
    }, [pcfContext.context.parameters.schedulerDisplayWeekend?.raw]);

    // Effect to update the scheduler config when displayWeekend changes
    useEffect(() => {
        if (schedulerData && schedulerData.config) {
            schedulerData.config.displayWeekend = displayWeekend;
            if (dispatch) {
                dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
            }
        }
    }, [displayWeekend]);

    return displayWeekend;
}