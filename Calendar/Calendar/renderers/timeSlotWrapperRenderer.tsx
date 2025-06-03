import * as React from "react";

// Modularized time slot wrapper renderer for react-big-calendar
// Encapsulate minHeight logic here, allowing for dynamic calculation if needed
export function timeSlotWrapperRenderer(props: { children?: React.ReactNode; timeslots?: number }) {
  const { children, timeslots } = props;
  let minHeight = 40;
  if (typeof timeslots === "number") {
    minHeight = timeslots === 1 ? 40 : 20;
  }
  return <div style={{ minHeight }}>{children}</div>;
}
