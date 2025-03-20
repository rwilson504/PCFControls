import * as React from "react";
import { IdPrefixProvider, FluentProvider} from "@fluentui/react-components";
import { PcfContextProvider } from "./services/PcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/PcfContextService";
import { ExportPDFManagerControl } from "./components/ExportPDFManager";
import { useStyles } from "./utils/styles";

export const ExportPDFManagerApp: React.FC<IPcfContextServiceProps> = (props) => {
  const styles = useStyles();
  // Create the context service.
  const pcfContextService = new PcfContextService({ context: props.context, instanceid: props.instanceid, height: props.height });

  return (
    <PcfContextProvider pcfcontext={pcfContextService}>
      <IdPrefixProvider value={`app-${props.instanceid}-`}>
        <FluentProvider theme={pcfContextService.theme} className={styles.root}>
          <ExportPDFManagerControl {...props} />
        </FluentProvider>
      </IdPrefixProvider>
    </PcfContextProvider>
  );
};

export default ExportPDFManagerApp;