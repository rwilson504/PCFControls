import * as React from "react";
import { PcfContextProvider } from "./services/pcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/pcfContextService";
import SchedulerControl from "./components/scheduler";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ISchedulerControlProps } from "./types/schedulerTypes";

export const SchedulerApp: React.FC<ISchedulerControlProps> = (props) => {
  // Create the context service.
  const pcfContextService = new PcfContextService({ 
    context: props.context, 
    instanceid: props.instanceid, 
    height: props.height 
  });

  // Wrap the SchedulerControl in providers for drag-and-drop and PCF context.
  return (
    <DndProvider backend={HTML5Backend}>
      <PcfContextProvider pcfcontext={pcfContextService}>
        <SchedulerControl
          {...props}
        />
      </PcfContextProvider>
    </DndProvider>
  );
};

export default SchedulerApp;