import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class BooleanOptionset implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	// Value of the field is stored and used inside the control 
	private _value: boolean;
	// track if the value is null
	private _valueIsNull: boolean;
	// track if the control is disabled
	private _controlIsDisabled: boolean;
	// keep referenc to the select wrapper
	private _selectContainer: HTMLDivElement;
	// keep reference to the select control.
	private _selectControl: HTMLSelectElement;
	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	
private _container: HTMLDivElement;
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

		this._controlIsDisabled = context.mode.isControlDisabled;	
		this._valueIsNull = context.parameters.inputValue.raw === null;
		this._value = context.parameters.inputValue.raw;

		// create wrapper around the select element
		this._selectContainer = document.createElement("div");
		this._selectContainer.className = "select-wrapper";

		// create select element
		this._selectControl = document.createElement("select");		
		this._selectControl.className = "booleanOptionset";
		
		// @ts-expect-error The Options will never actually be null so just ignore.
		this.generateOptionElements(context.parameters.inputValue.attributes.Options);
		
		// add event listeners
		this._selectControl.addEventListener("focus", this.onFocus.bind(this));
		this._selectControl.addEventListener("blur", this.onBlur.bind(this));
		this._selectControl.addEventListener("change", this.onChange.bind(this));
	
		// append elements to page
		this._selectContainer.appendChild(this._selectControl);
		this._container.appendChild(this._selectContainer);

		// update the controls disabled state
		this.changeControlDisabledState();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{		
		// if the disabled state of the control changes update the control to reflect this
		if (this._controlIsDisabled !== context.mode.isControlDisabled)
		{
			this._controlIsDisabled = context.mode.isControlDisabled;
			this.changeControlDisabledState();
		}

		// if the value changed then updated the selected option.  This is important since the value
		// could be changed from the field being on the form multiple times such as in the case where
		// a business process stage displays the field as well as it being on the form.
		if (this._value != context.parameters.inputValue.raw){
			this._valueIsNull = context.parameters.inputValue.raw === null;
			this._value = context.parameters.inputValue.raw;
			this.changeControlSelectedOption();
		}
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
		//remove the event listeners from the page
		this._selectControl.removeEventListener("focus", this.onFocus.bind(this));
		this._selectControl.removeEventListener("blur", this.onBlur.bind(this));
		this._selectControl.removeEventListener("change", this.onChange.bind(this));
	}

	private onChange(evt: Event): void {
		//when the value in the select changes update the value in the form
		this._value = this._selectControl.selectedOptions[0].value.toLowerCase() === '1';
		this._valueIsNull = false;
        this._notifyOutputChanged();
	}

	private onFocus(evt: Event): void {	
		// if the value is null then set the selected index to -1 which is out of the range of actual values
		if (this._valueIsNull){
			this._selectControl.selectedIndex = -1;
		}
	}

	private onBlur(evt: Event): void {
		// if the selected index is -1 then force a selection of the first real value which will cause the onChange event to fire
		if (this._selectControl.selectedIndex === -1){
			this._selectControl.selectedIndex = 0;
		}
	}
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private generateOptionElements(options: any[]): void {		
			for(const option of options)
			{
				const optionElement: HTMLOptionElement = document.createElement("option");
				optionElement.value = option.Value;
				optionElement.innerHTML = option.Label;
				
				const optionValue = option.Value === 1;
				if (optionValue === this._value)
				{
					optionElement.selected = true;
				}

				this._selectControl.appendChild(optionElement);
			}			
	}

	private changeControlDisabledState(): void{
		if (this._controlIsDisabled){
			this._selectContainer.setAttribute("disabled", "disabled");
			this._selectControl.setAttribute("disabled", "disabled");
		}
		else{
			this._selectContainer.removeAttribute("disabled");
			this._selectControl.removeAttribute("disabled");
		}
	}

	private changeControlSelectedOption(): void{
		const selectValue = this._value ? "1" : "0";
		this._selectControl.value = selectValue;
	}
}