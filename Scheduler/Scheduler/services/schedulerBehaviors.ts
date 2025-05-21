import { ViewType, CellUnit, SchedulerData } from "react-big-schedule";
import { ExtendedSchedulerData, ExtendedSchedulerDataConfig } from "../types";
import { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";


// Extend dayjs with the weekday plugin
import dayjs from "dayjs";
dayjs.extend(weekday);

export const getCustomDate = (
    schedulerData: ExtendedSchedulerData,
    num: number,
    date: string | Dayjs = schedulerData.startDate
): { startDate: string; endDate: string; cellUnit: CellUnit } => {
    const { viewType, localeDayjs } = schedulerData;
    let start: Dayjs;
    let end: Dayjs;
    let cellUnit: CellUnit;

    const baseDate = localeDayjs(date);

    if (viewType === ViewType.Custom) {
        // Work Week: Use dynamic days from config
        const days: number[] = schedulerData.config.workWeekDays || [1, 2, 3, 4, 5]; // Default: Mon-Fri
       
        const startDay = days[0] - 1; // Convert to Dayjs weekday
        const endDay = days[days.length - 1] - 1;

        // Find the start of the week, then move to the correct start day
        start = baseDate.weekday(startDay);
        if (num !== 0) start = start.add(2 * num, 'weeks');
        end = start.weekday(endDay);
        cellUnit = CellUnit.Day;
    } else if (viewType === ViewType.Custom1) {
        // Events: month-based
        start = baseDate.startOf('month');
        if (num !== 0) start = start.add(2 * num, 'months');
        end = start.add(1, 'months').endOf('month');
        cellUnit = CellUnit.Day;
    } else {
        // Default: day-based
        start = num === 0 ? baseDate : baseDate.add(2 * num, 'days');
        end = start.add(1, 'days');
        cellUnit = CellUnit.Hour;
    }

    return {
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        cellUnit
    };
};