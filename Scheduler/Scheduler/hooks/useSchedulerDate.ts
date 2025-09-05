import { useState, useEffect } from "react";
import { SchedulerData } from "react-big-schedule";
import { Event, SchedulerAction } from "../types/schedulerTypes";
import { parseDateOnly } from "../utils/formattingHelpers";
import { PcfContextService } from "pcf-context-service";

export function useSchedulerDate(
    pcfContext: PcfContextService,
    state: { schedulerData: SchedulerData | null },
    events: Event[],
    dispatch: (action: SchedulerAction) => void,
    schedulerView: string,
    onDateChange: (
        date: Date,
        viewStart: Date,
        viewEnd: Date,
        viewName: string
    ) => void
): [string, (date: string) => void] {
    const [schedulerDate, setSchedulerDate] = useState<string>(() => {
        const raw = pcfContext.context.parameters.schedulerDate?.raw as string | Date | undefined;
        return typeof raw === "string"
            ? raw
            : raw instanceof Date
                ? raw.toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10);
    });

    // Sync schedulerDate with parameter changes
    useEffect(() => {
        const raw = pcfContext.context.parameters.schedulerDate?.raw as string | Date | undefined;
        let newDate = new Date().toISOString().slice(0, 10);
        if (typeof raw === "string") {
            newDate = raw;
        } else if (raw instanceof Date) {
            newDate = raw.toISOString().slice(0, 10);
        }
        if (schedulerDate !== newDate) {
            setSchedulerDate(newDate);
        }
    }, [pcfContext.context.parameters.schedulerDate?.raw]);

    // Update SchedulerData and call onDateChange when schedulerDate changes
    useEffect(() => {
        if (state.schedulerData && schedulerDate) {
            // Call onDateChange if provided
            if (onDateChange) {
                onDateChange(
                    parseDateOnly(schedulerDate),
                    state.schedulerData.getViewStartDate().toDate(),
                    state.schedulerData.getViewEndDate().toDate(),
                    schedulerView
                );
            }

            state.schedulerData.setDate(schedulerDate);
            state.schedulerData.setEvents(events);
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });            
        }
    }, [schedulerDate]);

    return [schedulerDate, setSchedulerDate];
}