import {
    Resource as SchedulerResource,
    EventItem as SchedulerEventItem,
    SchedulerProps
} from "react-big-schedule";

/**
 * Resource type for Scheduler, extend if you need custom fields.
 */
export type Resource = SchedulerResource;

/**
 * Event type for Scheduler, extend if you need custom fields.
 */
export type Event = SchedulerEventItem;

/**
 * Demo data structure for generated demo data.
 */
export interface DemoDataType {
    resources: Resource[];
    events: Event[];
}

/**
 * Props for the SchedulerControl component.
 * Extend this interface with any additional props you want to pass.
 */
export interface ISchedulerControlProps extends Partial<SchedulerProps<Event>> {
    // Add custom props here if needed
}