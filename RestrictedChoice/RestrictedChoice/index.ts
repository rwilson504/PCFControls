import * as React from "react";
import * as ReactDOM from "react-dom"; // Import ReactDOM.
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { RestrictedChoiceApp } from "./RestrictedChoiceApp";
import { v4 as uuidv4 } from "uuid";
import { IRestrictedChoiceAppProps } from "./RestrictedChoiceApp";

export class RestrictedChoice
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  // Allow either a single number or an array of numbers.
  private selectedValue: number | number[] | null;
  private rootContainer: HTMLDivElement; // Store the container element.
  private contextInstanceId: string;
  private props: IRestrictedChoiceAppProps;

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

  // onChange callback now accepts either a number or an array of numbers.
  private onChange = (newValue: number | number[] | null): void => {
    if (newValue === -1 || (Array.isArray(newValue) && newValue.includes(-1))) {
      this.selectedValue = null;
    } else {
      this.selectedValue = newValue;
    }
    this.notifyOutputChanged();
  };

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    // Assert the type for the raw choiceProperty.
    const restrictedChoicesRaw = context.parameters.restrictedChoices.raw ?? "";
    const restrictedChoiceVisibilityRaw = context.parameters
      .restrictedChoiceVisibility.raw as string;
    const restrictChoicesRaw = context.parameters.restrictChoices.raw ?? true;
    // @ts-expect-error this is defined
    const isMultiSelect = context.parameters.choiceProperty.attributes?.Type === "multiselectpicklist";

    this.props = {
      onChange: this.onChange,
      context: context,
      instanceid: this.contextInstanceId,
      // @ts-expect-error this is defined
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options: context.parameters.choiceProperty.attributes?.Options ?? [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      currentValue: isMultiSelect ? context.parameters.choiceProperty.raw : context.parameters.choiceProperty.raw?._val,
      restrictedOptions: restrictedChoicesRaw
        ? restrictedChoicesRaw.split(",").map((s) => parseInt(s.trim(), 10))
        : [],
      restrictedChoiceVisibility: parseInt(
        restrictedChoiceVisibilityRaw || "1",
        10
      ),
      restrictChoices: restrictChoicesRaw,
      isMultiSelect: isMultiSelect,      
      // @ts-expect-error this is defined
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      defaultValue: context.parameters.choiceProperty.attributes?.DefaultValue,
    };

    return React.createElement(RestrictedChoiceApp, this.props);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return { choiceProperty: this.selectedValue } as IOutputs;
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
