/// <reference path="../node_modules/azure-maps-control/typings/index.d.ts" />
import * as ReactDOM from 'react-dom';
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {BusinessProcessFlowButtonsControl} from "./BusinessProcessFlowButtonsControl"
import {Spinner} from 'spin.js'
import atlas = require("azure-maps-control");
import { isNumber, isString } from "util";
import { IProps } from "./BusinessProcessFlowButtonsControl";
import * as React from 'react';

interface IPosition {
	latitude: number,
	longitude: number
}

export class BusinessProcessFlowButtons implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	
	//contains all the elements for the control
	private _container: HTMLDivElement;	
	private props: IProps;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	// Event Handler 'refreshData' reference
    private _refreshData: EventListenerOrEventListenerObject;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
		
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
		this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._container = container;		

		this.props = {
			pcfContext: this._context
		};	
		
		
	}	

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{				
						this.renderComponent();		
	}

	private renderComponent(){
		ReactDOM.render(
			React.createElement(
				BusinessProcessFlowButtonsControl, this.props
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
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		//unmount control on destroy
		ReactDOM.unmountComponentAtNode(this._container);
	}

}