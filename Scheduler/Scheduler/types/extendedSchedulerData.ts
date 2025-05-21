import { SchedulerData, SchedulerDataConfig, EventItem } from "react-big-schedule";

export interface ExtendedSchedulerDataConfig extends SchedulerDataConfig {
    workWeekDays?: number[];
}

export class ExtendedSchedulerData<EventType extends EventItem = EventItem> extends SchedulerData<EventType> {
    config: ExtendedSchedulerDataConfig;

    constructor(
        startDate: string,
        viewType: number,
        showAgenda: boolean,
        isEventPerspective: boolean,
        config: ExtendedSchedulerDataConfig,
        behaviors?: any
    ) {
        super(startDate, viewType, showAgenda, isEventPerspective, config, behaviors);
        this.config = config;
    }
}