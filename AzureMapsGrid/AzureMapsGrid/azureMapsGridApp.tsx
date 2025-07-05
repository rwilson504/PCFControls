import * as React from "react";
import { PcfContextProvider } from "./services/pcfContext";
import { PcfContextService } from "./services/pcfContextService";
import AzureMapsGridControl from "./components/azureMapsGridControl";
import { IAzureMapsGridControlProps } from "./types";

export const AzureMapsGridApp: React.FC<IAzureMapsGridControlProps> = (props) => {
  const pcfContextService = new PcfContextService({
    context: props.context,
    instanceid: props.instanceid,
    height: props.height,
  });

  return (
    <PcfContextProvider pcfcontext={pcfContextService}>
      <AzureMapsGridControl {...props} />
    </PcfContextProvider>
  );
};

export default AzureMapsGridApp;
