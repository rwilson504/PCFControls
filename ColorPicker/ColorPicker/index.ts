import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IColorPickerCompProps, ColorPickerComp} from './ColorPicker';

export class ColorPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	// Value of the field is stored and used inside the control 
	private _value: string;	
	// Value the field is initially set to, use default value if not set
	//private _initialValue: string;
	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
	// Reference to the control container HTMLDivElement
 	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;
	
	private props: IColorPickerCompProps;
	/**
	 * Empty constructor.
	 */
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
		const defaultColor = context.parameters?.defaultColor?.raw || "#ffffff"
		this._value = context.parameters?.inputValue?.raw || defaultColor;
		//this._initialValue = this._value;

		if (!context.parameters.inputValue.raw){
			this.colorOnChange(this._value);
		}

		this.props = {
			pcfContext: context,
			initialColorValue: this._value,			
			onColorChange: this.colorOnChange.bind(this)			
		}					
	}	

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{		
		//this.props.inputValue = this._value;
		// this.props.inputValue = this._context.parameters?.inputValue?.raw || this._defaultColor;
		// this.props.isDisabled = this._context.mode.isControlDisabled;
		// this.props.isVisible = this._context.mode.isVisible,
		ReactDOM.render(
			React.createElement(
				ColorPickerComp, this.props
			), 
			this._container
		);
	}

	private colorOnChange(colorValue: string){
		this._value = colorValue;
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			inputValue: this._value
		  };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// clean up the react control
		ReactDOM.unmountComponentAtNode(this._container);
	}	
}