import * as React from "react";
import { IdPrefixProvider, FluentProvider } from "@fluentui/react-components";
import { PcfContextProvider } from "./services/PcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/PcfContextService";
import { AnnotationsGrid } from "./components/AnnotationsGrid";

export const PortalFilesApp: React.FC<IPcfContextServiceProps> = (props) => {
  // pcfContextService now provides ajax and data functions.
  const pcfContextService = new PcfContextService({ context: props.context, instanceid: props.instanceid, updatePrimaryProperty: props.updatePrimaryProperty });

  return (
    <PcfContextProvider pcfcontext={pcfContextService}>
      <IdPrefixProvider value={`portalfiles-${props.instanceid}-`}>
        <FluentProvider theme={pcfContextService.theme}>
          <AnnotationsGrid />
        </FluentProvider>
      </IdPrefixProvider>
    </PcfContextProvider>
  );
};

export default PortalFilesApp;
