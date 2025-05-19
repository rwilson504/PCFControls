import * as React from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Scheduler, SchedulerProps, EventItem } from "react-big-schedule";

// Cast Scheduler to ComponentType for JSX compatibility
const SchedulerWrapper: React.ComponentType<SchedulerProps<EventItem>> = Scheduler as unknown as React.ComponentType<SchedulerProps<EventItem>>;

export default SchedulerWrapper;