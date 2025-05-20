import {
    Resource as SchedulerResource,
    EventItem as SchedulerEventItem,
    SchedulerProps,
    SchedulerData as SchedulerDataBase
} from "react-big-schedule";
import { View} from "./schedulerViews";
import { IInputs, IOutputs } from "../generated/ManifestTypes";


/**
 * Resource type for Scheduler, extended with etn (entity type name).
 */
export interface Resource extends SchedulerResource {
    etn: string;
}

/**
 * Event type for Scheduler, extended with etn (entity type name).
 */
export interface Event extends SchedulerEventItem {
    id: number;
    etn: string;
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
    context: ComponentFramework.Context<IInputs>;
    instanceid: string;
    height: number | string;
    onDateChange?: (date: Date, rangeStart: Date, rangeEnd: Date, view: string) => void;
}
