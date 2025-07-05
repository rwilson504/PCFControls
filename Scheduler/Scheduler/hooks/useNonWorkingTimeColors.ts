import { secureHeapUsed } from "crypto";
import { useEffect, useState } from "react";
import { SchedulerData } from "react-big-schedule";
import { PcfContextService } from "pcf-context-service";
import { SchedulerAction } from "../types";

export interface NonWorkingTimeColors {
    headColor: string;
    headBgColor: string;
    bodyBgColor: string;
}

export function useNonWorkingTimeColors(
    pcfContext: PcfContextService,
    schedulerData: SchedulerData | null,
    dispatch: (action: SchedulerAction) => void
): NonWorkingTimeColors {
    const getColors = (): NonWorkingTimeColors => ({
        headColor: pcfContext.context.parameters.nonWorkingTimeHeadColor?.raw || "#999999",
        headBgColor: pcfContext.context.parameters.nonWorkingTimeHeadBgColor?.raw || "#fff0f6",
        bodyBgColor: pcfContext.context.parameters.nonWorkingTimeBodyBgColor?.raw || "#fff0f6",
    });

    const [nonWorkingTimeColors, setNonWorkingTimeColors] = useState<NonWorkingTimeColors>(getColors);

    useEffect(() => {
        setNonWorkingTimeColors(getColors());
    }, [
        pcfContext.context.parameters.nonWorkingTimeHeadColor?.raw,
        pcfContext.context.parameters.nonWorkingTimeHeadBgColor?.raw,
        pcfContext.context.parameters.nonWorkingTimeBodyBgColor?.raw,
    ]);

    // Optionally update the scheduler config when colors change
    useEffect(() => {
        if (schedulerData && schedulerData.config) {
            schedulerData.config.nonWorkingTimeHeadColor = nonWorkingTimeColors.headColor;
            schedulerData.config.nonWorkingTimeHeadBgColor = nonWorkingTimeColors.headBgColor;
            schedulerData.config.nonWorkingTimeBodyBgColor = nonWorkingTimeColors.bodyBgColor;
            if (dispatch) {
                dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
            }
        }
    }, [nonWorkingTimeColors]);

    return nonWorkingTimeColors;
}