import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { PercentCrop, PixelCrop } from "react-image-crop";
import { v4 as uuidv4 } from "uuid";
import ImageCropApp from "./imageCropApp";
import { ActionOutputSchema } from "./types/actionOutputSchema";

export class ImageCrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _instanceId: string;
    private _reactRoot: ReactDOM.Root;
    private _actionDragStart: boolean;
    private _actionDragEnd: boolean;
    private _actionCropComplete: boolean;
    private _cropResults: string | undefined;
    private _actionOutput: { action: string, x: number, y: number } | null;

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
        context.mode.trackContainerResize(true);
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._container = container;
        this._container.style.width = "100%";
        this._container.style.height = "100%";
        this._instanceId = uuidv4();
        this._reactRoot = ReactDOM.createRoot(this._container);
    }

    /**
     * Returns the output schema for the control, used by Power Apps to validate the shape of output properties.
     * This is required for controls with object-typed outputs (e.g., actionOutput).
     * @param context The PCF context object
     * @returns A promise resolving to the output schema object
     */
    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            actionOutput: ActionOutputSchema
        });
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {        
        this._context = context;
        this._reactRoot.render(
            React.createElement(ImageCropApp, {
                context: this._context,
                instanceid: this._instanceId,
                height: context.mode.allocatedHeight,
                onDragStart: this.onDragStart.bind(this),
                onDragEnd: this.onDragEnd.bind(this),
                onCropComplete: this.onCropComplete.bind(this),
            })
        );
    }

    /**
     * Callback invoked when a crop operation is completed.
     * Sets the crop result and triggers output notification.
     * @param results The base64 string of the cropped image
     */
    public onCropComplete = (results: string) => {
        this._actionCropComplete = true;
        this._cropResults = results;
        this._notifyOutputChanged();
    };

    /**
     * Callback invoked when a drag operation starts on the crop area.
     * Sets the action output to 'dragStart' and pointer coordinates, then notifies output change.
     * @param e PointerEvent from the drag start
     */
    public onDragStart = (e: PointerEvent) => {
        this._actionDragStart = true;
        this._actionOutput = {
            action: "dragStart",
            x: e.clientX,
            y: e.clientY
        };
        this._notifyOutputChanged();
    };

    /**
     * Callback invoked when a drag operation ends on the crop area.
     * Sets the action output to 'dragEnd' and pointer coordinates, then notifies output change.
     * @param e PointerEvent from the drag end
     */
    public onDragEnd = (e: PointerEvent) => {
        this._actionDragEnd = true;
        this._actionOutput = {
            action: "dragEnd",
            x: e.clientX,
            y: e.clientY
        };
        this._notifyOutputChanged();
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {

        const output: IOutputs = {
            actionOutput: null
        };

        if (this._actionCropComplete) {
            //notifyAgain = true;
            output.imageOutput = this._cropResults ? this._cropResults : undefined;
            this._actionCropComplete = false;
        }

        if (this._actionDragStart || this._actionDragEnd) {
            output.actionOutput = this._actionOutput;
            this._actionOutput = null;
        }
       
        return output;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
