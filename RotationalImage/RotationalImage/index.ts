import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IProps, RotationalImageComp } from "./RotationalImageComponent";

export class RotationalImage implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;
	private _container: HTMLDivElement;
	private props: IProps;

	private _actionImageClicked: boolean;
	private _updateFromOutput: boolean;

	
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{	
		context.mode.trackContainerResize(true);

		this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._container = container;
		this.props = {
			pcfContext: context,
			onClickEvent: this.handleOnClick.bind(this)
		}
		this._actionImageClicked = false;
		this._updateFromOutput = false;
	}

	public handleOnClick = () => {
		console.log('test');
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (this._updateFromOutput){
			this._updateFromOutput = false;
			return;
		}

		ReactDOM.render(
			React.createElement(
				RotationalImageComp, this.props
			), 
			this._container
		);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		//let the update know that this is coming from an output so it doesn't re-render
		this._updateFromOutput = true;

		//create the output
		let output: IOutputs = {
			actionImageClicked: this._actionImageClicked
		}		

		//set image clicked to false
		this._actionImageClicked = false;

		//do a second notification to set the image clicked to false
		this._notifyOutputChanged();

		return output;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}