import { ViewType, View as SchedulerView } from "react-big-schedule";


/**
 * Extended View type to include a unique name field for each view.
 * Used to define available views in the scheduler (e.g., day, week, month).
 */
export interface View extends SchedulerView {
    /** Unique identifier for the view (for internal use, localization, etc.) */
    name: string; // This is the key for localization and internal use
    /** Display name for the view (will be localized at runtime) */
    viewName: string;
    /** Optional: Days of the week for work week views */
    workWeekDays?: number[];
}

/**
 * List of all supported scheduler views
 */
export const SCHEDULER_VIEWS: View[] = [
    { name: 'day', viewName: 'view_day', viewType: ViewType.Day, showAgenda: false, isEventPerspective: false },
    { name: 'week', viewName: 'view_week', viewType: ViewType.Week, showAgenda: false, isEventPerspective: false },
    { name: 'month', viewName: 'view_month', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
    { name: 'quarter', viewName: 'view_quarter', viewType: ViewType.Quarter, showAgenda: false, isEventPerspective: false },
    { name: 'year', viewName: 'view_year', viewType: ViewType.Year, showAgenda: false, isEventPerspective: false },
    { name: 'work_week', viewName: 'view_work_week', viewType: ViewType.Custom, showAgenda: false, isEventPerspective: false}, // Monday to Friday
    { name: 'event', viewName: 'view_event', viewType: ViewType.Custom1, showAgenda: false, isEventPerspective: true }
];


/**
 * Utility to get a view by its unique name.
 * @param views - array of View objects
 * @param name - unique name of the view
 * @returns the matching View or undefined
 */
export function getViewByName(views: View[], name: string): View | undefined {
    return views.find(v => v.name === name);
}