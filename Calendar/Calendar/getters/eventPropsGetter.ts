import { IEvent } from "../types";
import * as Color from "color";

export function eventPropsGetter(
  event: IEvent,
  isEventSelectable: boolean,
  eventDefaultBackgroundColor: Color<string> | string,
  calendarBorderColor: Color<string> | string
) {
  return {
    style: {
      cursor: isEventSelectable ? "pointer" : "default",
      backgroundColor: event.color || eventDefaultBackgroundColor.toString(),
      color: Color(event.color || eventDefaultBackgroundColor).isDark()
        ? "#fff"
        : "#000",
      borderColor: calendarBorderColor.toString(),
    },
  };
}
