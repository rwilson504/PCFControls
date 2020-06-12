import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class CanvasFileUploader implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _fileInput: HTMLInputElement;
	private _notifyOutputChanged: () => void;	
	private _outputType: string;
	private _value: string;
	private _fileName: string;

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

		this._value = "";
		this._fileName = "";
		this._outputType = context.parameters.outputType.raw || 'DataUrl';

		this._fileInput = document.createElement('input');
		this._fileInput.type = "file"
		this._fileInput.style.display = context.mode.isVisible ? "block" : "none";		

		this._fileInput.onchange = this.onFileInputChange.bind(this);
		container.appendChild(this._fileInput);
	}

	public onFileInputChange = () => {		
		
		if (this._fileInput.files?.length === 0) 
		{			
			this._notifyOutputChanged()
			return;
		}
		
		let file = this._fileInput.files![0];
		this._fileName = file.name;

		var fileReader = new FileReader();
		fileReader.onloadend = () => {
			this._value = fileReader.result as string;
			this._notifyOutputChanged();
		}
		
		if (this._outputType === 'Text')
		{
			fileReader.readAsText(file);
		}
		else{
			fileReader.readAsDataURL(file);
		}		
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		var params = context.parameters;
		this._fileInput.accept = params.acceptedFileTypes.raw || "";				
		this._fileInput.style.display = context.mode.isVisible ? "block" : "none"
		this._outputType = context.parameters.outputType.raw || 'DataUrl';
		if (!params.triggerFileSelector?.raw) return;
		this._fileInput.click();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {			
			value: this._value,
			fileName: this._fileName,
			triggerFileSelector: false
		};
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