import * as React from "react";
import { PcfContextProvider } from "./services/PcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/PcfContextService";
import SchedulerControl from "./components/Scheduler";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
//import { useStyles } from "./utils/styles";

export const SchedulerApp: React.FC<IPcfContextServiceProps> = (props) => {
  // Create the context service.
  const pcfContextService = new PcfContextService({ context: props.context, instanceid: props.instanceid, height: props.height });

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