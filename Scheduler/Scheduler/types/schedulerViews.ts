import { ViewType, View as SchedulerView } from "react-big-schedule";

/**
 * Extended View type to include a unique name field for each view.
 */
export interface View extends SchedulerView {
    /** Unique identifier for the view (for internal use, localization, etc.) */
    name: string;
}

export const SCHEDULER_VIEWS: View[] = [
    { name: 'day', viewName: 'Day', viewType: ViewType.Day, showAgenda: false, isEventPerspective: false },
    { name: 'week', viewName: 'Week', viewType: ViewType.Week, showAgenda: false, isEventPerspective: false },
    { name: 'month', viewName: 'Month', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
    { name: 'quarter', viewName: 'Quarter', viewType: ViewType.Quarter, showAgenda: false, isEventPerspective: false },
    { name: 'year', viewName: 'Year', viewType: ViewType.Year, showAgenda: false, isEventPerspective: false },
    { name: 'work_week', viewName: 'Work Week', viewType: ViewType.Custom, showAgenda: false, isEventPerspective: false },
    { name: 'agenda', viewName: 'Agenda', viewType: ViewType.Custom1, showAgenda: true, isEventPerspective: false },
    { name: 'event', viewName: 'Events', viewType: ViewType.Custom2, showAgenda: false, isEventPerspective: true }
];

/**
 * Utility to get a view by its unique name.
 */
export function getViewByName(views: View[], name: string): View | undefined {
    return views.find(v => v.name === name);
}