import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";
import { Event, SchedulerAction } from "../types/schedulerTypes";
import { PcfContextService } from "../services/pcfContextService";

/**
 * Returns an array of day numbers representing the work week range,
 * based on schedulerWorkWeekStart and schedulerWorkWeekEnd parameters.
 * 1=Sunday, 2=Monday, ..., 7=Saturday
 */
export function useWorkWeekDays(
    pcfContext: PcfContextService, 
    schedulerData: SchedulerData | null, 
    dispatch?: (action: SchedulerAction) => void): number[] 
    {
    const parseDays = () => {
        // Default: Monday (1) to Friday (5) in 0-indexed (so 1=Monday, 5=Friday)
        const start = Number(pcfContext.context.parameters.schedulerWorkWeekStart?.raw);
        const end = Number(pcfContext.context.parameters.schedulerWorkWeekEnd?.raw);

        const startDay = isNaN(start) ? 1 : start; // Default to 1 (Monday)
        const endDay = isNaN(end) ? 5 : end;       // Default to 5 (Friday)

        // Ensure valid range and handle wrap-around (e.g., Thu (4) to Tue (2))
        if (startDay <= endDay) {
            return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
        } else {
            // If start > end, wrap around the week (e.g., 5–1 for Fri–Mon)
            return [
                ...Array.from({ length: 7 - startDay }, (_, i) => startDay + i),
                ...Array.from({ length: endDay + 1 }, (_, i) => i)
            ];
        }
    };

    const [workWeekDays, setWorkWeekDays] = useState<number[]>(parseDays);

    useEffect(() => {
        setWorkWeekDays(parseDays());
    }, [
        pcfContext.context.parameters.schedulerWorkWeekStart?.raw,
        pcfContext.context.parameters.schedulerWorkWeekEnd?.raw
    ]);

    // Effect to update the config when workWeekDays changes
    useEffect(() => {
        if (schedulerData && schedulerData.config) {
            const config = schedulerData.config;
            const updatedConfig = { ...config, workWeekDays: workWeekDays };
            schedulerData.config = updatedConfig;
            if (dispatch) {
                dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
            }
        }
    }, [workWeekDays]);

    return workWeekDays;
}