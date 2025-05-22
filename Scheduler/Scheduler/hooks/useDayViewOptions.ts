import { useEffect, useState } from "react";
import { SchedulerData } from "react-big-schedule";
import { PcfContextService } from "../services/pcfContextService";
import { SchedulerAction } from "../types";

export interface DayViewOptions {
    startHour: number;
    endHour: number;
    minuteStep: number;
}

export function useDayViewOptions(
    pcfContext: PcfContextService,
    schedulerData: SchedulerData | null,
    dispatch: (action: SchedulerAction) => void
): DayViewOptions {
    const getOptions = (): DayViewOptions => ({
        startHour: Number(pcfContext.context.parameters.dayStartFrom?.raw ?? 0),
        endHour: Number(pcfContext.context.parameters.dayStopTo?.raw ?? 23),
        minuteStep: Number(pcfContext.context.parameters.minuteStep?.raw ?? 30),
    });

    const [dayViewOptions, setDayViewOptions] = useState<DayViewOptions>(getOptions);

    useEffect(() => {
        setDayViewOptions(getOptions());
    }, [
        pcfContext.context.parameters.dayStartFrom?.raw,
        pcfContext.context.parameters.dayStopTo?.raw,
        pcfContext.context.parameters.minuteStep?.raw,
    ]);

    // Optionally update the scheduler config when options change
    useEffect(() => {
        if (schedulerData && schedulerData.config) {
            schedulerData.config.dayStartFrom = dayViewOptions.startHour;
            schedulerData.config.dayStopTo = dayViewOptions.endHour;
            schedulerData.config.minuteStep = dayViewOptions.minuteStep;
            if (dispatch) {
                dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
            }
        }
    }, [dayViewOptions]);

    return dayViewOptions;
}