import {
    Resource as SchedulerResource,
    EventItem as SchedulerEventItem,
    SchedulerProps,
    SchedulerData
} from "react-big-schedule";
import { IInputs } from "../generated/ManifestTypes";



/**
 * Resource type for Scheduler, extended with etn (entity type name).
 * Used to represent a resource (e.g., user, room) in the scheduler.
 */
export interface Resource extends SchedulerResource {
    etn: string;
}


/**
 * Event type for Scheduler, extended with etn (entity type name).
 * Used to represent a scheduled event or appointment.
 */
export interface Event extends SchedulerEventItem {
    etn: string;
    description?: string;
}


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
    /** PCF context object */
    context: ComponentFramework.Context<IInputs>;
    /** Unique instance ID for the control */
    instanceid: string;
    /** Height of the control (number or string) */
    height: number | string;
    /** Callback when the date or view changes */
    onDateChange: (date: Date, rangeStart: Date, rangeEnd: Date, view: string) => void;
    /** Callback when a record is selected (clicked) */
    onClickSelectedRecord: (recordId: string) => void;
    /** Callback when a slot is selected (clicked) */
    onClickSelectedSlot: (slotId: string) => void;
    /** Callback when a new event is requested (slot selection) */
    onNewEvent: (slotId: string, start: Date, end: Date ) => void;
}


/**
 * Action types for the scheduler reducer
 */
export type SchedulerAction =
    | { type: "INITIALIZE"; payload: SchedulerData }
    | { type: "UPDATE_SCHEDULER"; payload: SchedulerData };