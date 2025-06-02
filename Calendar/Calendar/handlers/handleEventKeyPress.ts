import * as CalendarUtils from "../utils";
import { IEvent } from "../types";
import * as React from "react";

export function handleEventKeyPress(_handleEventSelected: (event: IEvent) => void) {
  return (event: IEvent, e: React.SyntheticEvent<HTMLElement>) => {
    const keyboardEvent = e as unknown as React.KeyboardEvent<HTMLElement>;
    if (CalendarUtils.VALID_KEYS.includes(keyboardEvent.key)) {
      _handleEventSelected(event);
    }
  };
}
