import * as React from "react";
import { Scheduler, SchedulerProps, EventItem } from "react-big-schedule";

// Cast Scheduler to ComponentType for JSX compatibility
const SchedulerWrapper: React.ComponentType<SchedulerProps<EventItem>> = Scheduler as unknown as React.ComponentType<SchedulerProps<EventItem>>;

export default SchedulerWrapper;