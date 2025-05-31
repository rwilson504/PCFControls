import * as React from "react";
import * as Color from "color";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function agendaEventRenderer({ event }: any, isEventSelectable: boolean, eventDefaultBackgroundColor: any) {
  return (
    <span
      title={event.title}
      style={{
        cursor: isEventSelectable ? "pointer" : "default",
        overflow: "auto",
        display: "block",
        backgroundColor:
          event.color || eventDefaultBackgroundColor.toString(),
        padding: "5px",
        color: Color(event.color || eventDefaultBackgroundColor).isDark()
          ? "#fff"
          : "#000",
      }}
    >
      {event.title}
    </span>
  );
}
