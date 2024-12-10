import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class DadJoke implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	
	private _notifyOutputChanged: () => void;
	private _thisIsTheWorst: string;
	private _theJokeLivesHere: HTMLTextAreaElement;

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
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
	{
		//this will ensure that if the container size changes the updateView function will be called.
		context.mode.trackContainerResize(true);
		this._notifyOutputChanged = notifyOutputChanged;
		this._thisIsTheWorst = '';
		
		//text area for joke
		this._theJokeLivesHere = document.createElement("textarea");		
		this._theJokeLivesHere.readOnly = true;
		this._theJokeLivesHere.setAttribute("autocomplete", "off");
		this._theJokeLivesHere.setAttribute("class", "textAreaControl");
		if (context.mode.allocatedHeight !== -1){
			this._theJokeLivesHere.style.height = `${(context.mode.allocatedHeight - 25).toString()}px`;
		}
		//append the joke to the container
		container.appendChild(this._theJokeLivesHere);		
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void>
	{
		if (context.mode.allocatedHeight !== -1){
			this._theJokeLivesHere.style.height = `${(context.mode.allocatedHeight - 25).toString()}px`;
		}
		
		if(context.parameters.ohNotAnotherOne.raw || this._thisIsTheWorst === '')
		{

			const response = await fetch(
				"https://icanhazdadjoke.com/",
				{
					headers: {
						"Accept" : "application/json"
					}
				}
			);
			
			const body = await response.json()

			this._thisIsTheWorst = body.joke;
			this._theJokeLivesHere.textContent = body.joke;

			this._notifyOutputChanged();
		}
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			youAskedForIt: this._thisIsTheWorst,
			ohNotAnotherOne: false
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
