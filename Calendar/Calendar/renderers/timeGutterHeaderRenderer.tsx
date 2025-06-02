import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function timeGutterHeaderRenderer(ref: any) {
  return (
    <span
      title={ref ? ref.props.messages.allDay : ""}
      className="rbc-time-header-gutter-all-day"
    >
      {ref ? ref.props.messages.allDay : ""}
    </span>
  );
}
