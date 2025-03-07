import * as React from "react";
import { IdPrefixProvider, FluentProvider} from "@fluentui/react-components";
import { PcfContextProvider } from "./services/PcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/PcfContextService";
import { RestrictedChoiceControl } from "./components/RestrictedChoice";
import { useStyles } from "./utils/styles";

// Extend the props interface to include both PCF context and control props.
export interface IRestrictedChoiceAppProps extends IPcfContextServiceProps {
  onChange: (newValue: number | number[] | null) => void;
  // These props are passed from index.ts
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  restrictedOptions: number[];
  restrictedChoiceVisibility: number; // 1 for Disabled, 0 for Hide
  currentValue: number | number[] | null;
  restrictChoices: boolean;
  isMultiSelect: boolean;
  defaultValue?: number | number[] | null;
}

export const RestrictedChoiceApp: React.FC<IRestrictedChoiceAppProps> = (props) => {
  const styles = useStyles();
  // Create the context service.
  const pcfContextService = new PcfContextService({ context: props.context, instanceid: props.instanceid });

  return (
    <PcfContextProvider pcfcontext={pcfContextService}>
      <IdPrefixProvider value={`app-${props.instanceid}-`}>
        <FluentProvider theme={pcfContextService.theme} className={styles.root}>
          <RestrictedChoiceControl {...props} />
        </FluentProvider>
      </IdPrefixProvider>
    </PcfContextProvider>
  );
};

export default RestrictedChoiceApp;