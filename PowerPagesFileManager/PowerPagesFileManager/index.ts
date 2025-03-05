import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import { IPcfContextServiceProps } from "./services/PcfContextService";
import { PortalFilesApp } from "./PortalFilesApp";

export class PowerPagesFileManager
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container!: HTMLDivElement;
  private _reactRoot?: Root;
  private _props: IPcfContextServiceProps;
  private _notifyOutputChanged: () => void;
  private _sampleProperty: string | undefined;

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
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    // Add control initialization code
    this._container = container;
    this._reactRoot = createRoot(this._container);
    this._notifyOutputChanged = notifyOutputChanged;

    this._props = {
      context: context,
      instanceid: uuidv4(),
      updatePrimaryProperty: this.updatePrimaryProperty.bind(this),
    };
  }

  /**
   * Updates the sample property and notifies the framework of the change.
   */
  private updatePrimaryProperty(value: string | undefined): void {
    this._sampleProperty = value;
    this._notifyOutputChanged();
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._props.context = context;
    this._reactRoot?.render(
      React.createElement(PortalFilesApp, {
        ...this._props        
      })
    );
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {
      sampleProperty: this._sampleProperty
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Cleanup React component
    this._reactRoot?.unmount();
  }  
}
