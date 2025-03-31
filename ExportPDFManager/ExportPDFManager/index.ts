import * as React from "react";
import * as ReactDOM from "react-dom"; // Import ReactDOM.
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ExportPDFManagerApp } from "./ExportPDFManagerApp";
import { v4 as uuidv4 } from "uuid";
import { IPcfContextServiceProps } from "./services/PcfContextService";

export class ExportPDFManager
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  // Allow either a single number or an array of numbers.
  private selectedValue: number | number[] | null;
  private rootContainer: HTMLDivElement; // Store the container element.
  private contextInstanceId: string;
  private props: IPcfContextServiceProps;

  /**
   * Empty constructor.
   */
  constructor() {
    // Empty
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container The container element for the control.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement // Add container parameter.
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.rootContainer = container; // Save the container reference.
    // Optionally store instance id if needed.
    this.contextInstanceId = uuidv4();
    context.mode.trackContainerResize(true);
  }  

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    
    this.props = {
      context: context,
      instanceid: this.contextInstanceId,
      height: context.parameters.height?.raw ?? 500,   
    };

    return React.createElement(ExportPDFManagerApp, this.props);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Unmount the React component from the container.
    ReactDOM.unmountComponentAtNode(this.rootContainer);
  }
}
