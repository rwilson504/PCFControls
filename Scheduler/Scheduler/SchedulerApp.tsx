import * as React from "react";
import { PcfContextProvider } from "./services/pcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/pcfContextService";
import SchedulerControl from "./components/scheduler";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ISchedulerControlProps } from "./types/schedulerTypes";
//import { useStyles } from "./utils/styles";

export const SchedulerApp: React.FC<ISchedulerControlProps> = (props) => {
  // Create the context service.
  const pcfContextService = new PcfContextService({ 
    context: props.context, 
    instanceid: props.instanceid, 
    height: props.height 
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <PcfContextProvider pcfcontext={pcfContextService}>
        <SchedulerControl
          // Pass only the props defined in ISchedulerControlProps
          // Example: id={props.instanceid} height={props.height}
          // Replace the following with the actual ISchedulerControlProps fields
          {...(props as any)}
        />
      </PcfContextProvider>
    </DndProvider>
  );
};

export default SchedulerApp;