import { ViewType, CellUnit, SchedulerData } from "react-big-schedule";
import { Dayjs } from "dayjs";

/**
 * Returns custom date ranges for custom views.
 */
export function getCustomDateFunc(
    schedulerData: SchedulerData,
    num: number,
    date?: string | Dayjs
): { startDate: string | Dayjs; endDate: string | Dayjs; cellUnit: CellUnit } {
    switch (schedulerData.viewType) {
        case ViewType.Custom:
            // Work Week: Monday–Friday
            {
                const start = schedulerData.localeDayjs(date).startOf("week").add(1, "day");
                const end = start.add(4, "day");
                return {
                    startDate: start.format("YYYY-MM-DD"),
                    endDate: end.format("YYYY-MM-DD"),
                    cellUnit: CellUnit.Day,
                };
            }
        case ViewType.Custom1:
            // Agenda: 30 days
            {
                const start = schedulerData.localeDayjs(date).startOf("day");
                const end = start.add(29, "day");
                return {
                    startDate: start.format("YYYY-MM-DD"),
                    endDate: end.format("YYYY-MM-DD"),
                    cellUnit: CellUnit.Day,
                };
            }
        case ViewType.Custom2:
            // Events: 7 days, event perspective
            {
                const start = schedulerData.localeDayjs(date).startOf("day");
                const end = start.add(6, "day");
                return {
                    startDate: start.format("YYYY-MM-DD"),
                    endDate: end.format("YYYY-MM-DD"),
                    cellUnit: CellUnit.Day,
                };
            }
        default:
            // Fallback: week view
            {
                const start = schedulerData.localeDayjs(date).startOf("week");
                const end = start.add(6, "day");
                return {
                    startDate: start.format("YYYY-MM-DD"),
                    endDate: end.format("YYYY-MM-DD"),
                    cellUnit: CellUnit.Day,
                };
            }
    }
};