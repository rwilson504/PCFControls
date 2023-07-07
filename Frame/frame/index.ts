import {IInputs, IOutputs} from "./generated/ManifestTypes";
var validUrl = require('valid-url');

export class frame implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _notifyOutputChanged: () => void;
	private _returnMessageFromFrame: (e: any) => void;
	private _context: ComponentFramework.Context<IInputs>;
	private _iframe: HTMLIFrameElement;
	private _url: string;
	private _messageFromFrame: string;
	private _updateFromOutput: boolean;

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
		context.mode.trackContainerResize(false);
		
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;		
		this._iframe = document.createElement("iframe");
		this._updateFromOutput = false;

		this._returnMessageFromFrame = (e: any) => {		
			if (!validUrl.isUri(context.parameters.src?.raw || '') ) return;			
			const sourceUrl = new URL(context.parameters.src.raw as string);
			const me  = this;
			Array.prototype.forEach.call(container.getElementsByTagName('iframe'), function (element) {
				if (element.contentWindow === e.source) {
					var returnData = e.data						
					me._messageFromFrame = returnData;					
					me._notifyOutputChanged()
				}
			});							
		};

		window.addEventListener('message', this._returnMessageFromFrame.bind(this), false);
				
		if(validUrl.isUri(context.parameters.src?.raw || ''))
		{
			let url = this._context.parameters.src.raw as string;
			this._url = url;
			this._iframe.src = url; 
		};

		this.setStyles();

		container.appendChild(this._iframe);		
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{	
		this.setStyles();
		
		if (this._updateFromOutput){
			this._updateFromOutput = false;
			return;
		}
				
		//update the iframe source if the url is valid and
		// the url is different from the original one or the user specifically chose to refresh the frame.
		if(validUrl.isUri(context.parameters.src?.raw || '') && (context.parameters.src?.raw != this._url || this._context.parameters.refresh.raw))
		{
			let url =  this._context.parameters.src.raw as string;
			this._url = url;
			this._iframe.src = url;
		};							
	}	

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		this._updateFromOutput = true;

		return {
			postMessageFromFrame: this._messageFromFrame,
			refresh: false
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		window.removeEventListener('message', this._returnMessageFromFrame.bind(this), false);
	}

	private setStyles(): void {

		this._iframe.style.border = "0";
		if (this._context.mode.allocatedHeight !== -1) {
			this._iframe.style.height = this._context.mode.allocatedHeight.toString();
			this._iframe.style.width = this._context.mode.allocatedWidth.toString();
		}
		else {
			///@ts-ignore
			this._iframe.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "calc(100% - 25px)";
			this._iframe.style.width = "100%";
		}
	}
}