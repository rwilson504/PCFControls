import { useEffect, useState } from "react";
import { SchedulerData } from "react-big-schedule";

/**
 * Hook to get the value of the schedulerDisplayWeekend property from PCF context.
 * Returns true if weekends should be displayed, false otherwise.
 * Defaults to true if the property is not set.
 */
export function useDisplayWeekend(
    pcfContext: any,
    schedulerData?: SchedulerData | null,
    dispatch?: (action: any) => void
): boolean {
    const getValue = () => {
        const raw = pcfContext.context.parameters.schedulerDisplayWeekend?.raw;
        if (typeof raw === "boolean") return raw;
        if (typeof raw === "string") return raw.toLowerCase() === "true";
        return true; // Default to true
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
                dispatch({ type: "UPDATE_SCHEDULER_CONFIG", payload: { schedulerData } });
            }
        }
    }, [displayWeekend]);

    return displayWeekend;
}