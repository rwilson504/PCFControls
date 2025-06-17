import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { PercentCrop, PixelCrop } from "react-image-crop";
import { v4 as uuidv4 } from "uuid";
import ImageCropApp from "./imageCropApp";

export class ImageCrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _calculatedHeight: number;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _instanceId: string;
    private _updateFromOutput: boolean;
    private _reactRoot: ReactDOM.Root;
    private _actionDragStart: boolean;
    private _actionDragEnd: boolean;
    private _actionCropComplete: boolean;
    private _cropResults: string | undefined;

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
        this._updateFromOutput = false;
        this._context = context;
        this._container = container;
        this._container.style.width = "100%";
        this._container.style.height = "100%";
        this._instanceId = uuidv4();
        this._reactRoot = ReactDOM.createRoot(this._container);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        if (this._updateFromOutput) {
            this._updateFromOutput = false;
            return;
        }

        this._reactRoot.render(
            React.createElement(ImageCropApp, {
                context: context,
                instanceid: this._instanceId,
                height: context.mode.allocatedHeight,
                onDragStart: this.onDragStart.bind(this),
                onDragEnd: this.onDragEnd.bind(this),
                onCropComplete: this.onCropComplete.bind(this),
            })
        );
    }

    // Callback for crop complete
    public onCropComplete = (results: string) => {
        this._actionCropComplete = true;
        this._cropResults = results;
        this._notifyOutputChanged();
    };

    // Callback for drag start
    public onDragStart = (e: PointerEvent) => {        
        this._actionDragStart = true;
        this._notifyOutputChanged();
    };

    // Callback for drag end
    public onDragEnd = (e: PointerEvent) => {
        this._actionDragEnd = true;
        this._notifyOutputChanged();
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        this._updateFromOutput = true;
        let notifyAgain = false;

        const output: IOutputs = {}

        if (this._actionCropComplete) {
            notifyAgain = true;
            output.imageOutput = this._cropResults ? this._cropResults : undefined;
            this._actionCropComplete = false;
        }

        if (this._actionDragStart) {
            notifyAgain = true;
            this._actionDragStart = false;
        }

        if (this._actionDragEnd) {
            notifyAgain = true;
            this._actionDragEnd = false;
        }

        if (notifyAgain) {
            this._notifyOutputChanged();
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
