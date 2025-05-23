import { SchedulerData, SchedulerDataConfig, EventItem, SchedulerDataBehaviors } from "react-big-schedule";

export interface ExtendedSchedulerDataConfig extends SchedulerDataConfig {
    workWeekDays?: number[];
    eventItemPopoverShowColor?: boolean; // <-- add this line
}

export class ExtendedSchedulerData<EventType extends EventItem = EventItem> extends SchedulerData<EventType> {
    config: ExtendedSchedulerDataConfig;

    constructor(
        startDate: string,
        viewType: number,
        showAgenda: boolean,
        isEventPerspective: boolean,
        config: ExtendedSchedulerDataConfig,
        behaviors?: SchedulerDataBehaviors<EventType>
    ) {
        super(startDate, viewType, showAgenda, isEventPerspective, config, behaviors);
        this.config = config;
    }
}