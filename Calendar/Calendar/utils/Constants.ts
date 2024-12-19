import { DayLayoutAlgorithm } from "react-big-calendar";

export const CALENDAR_VIEWS = ["month", "week", "work_week", "day", "agenda"] as string[];

export const DEFAULT_EVENT_COLOR = "#3174ad";
export const DEFAULT_TODAY_BACKGROUND_COLOR = "#eaf6ff";
export const DEFAULT_TEXT_COLOR = "#666666";
export const DEFAULT_BORDER_COLOR = "#dddddd";
export const DEFAULT_TIMEBAR_BACKGROUND_COLOR = "#ffffff";
export const DEFAULT_WEEKEND_BACKGROUND_COLOR = "#00000000";

export const DEFAULT_MIN_HOUR = 0;
export const DEFAULT_MAX_HOUR = 23;
export const DEFAULT_STEP = 30; // 30 minutes per time slot
export const DEFAULT_TIMESLOTS = 2; // Two slots per hour
export const DEFAULT_LAYOUT_ALGORITHM: DayLayoutAlgorithm = "overlap";
export const VALID_KEYS = ["Enter", " "];
export const DEFAULT_SELECTABLE = true;
export const DEFAULT_EVENT_SELECTABLE = true;
export const DEFAULT_POPUP = true;