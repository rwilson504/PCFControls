import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CalendarControl, IProps} from "./CalendarControl"

export class Calendar implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
	private _props: IProps;
	private _selectedAction: string;
	private _selectedRecordId: string;
	private _selectedSlotStart: Date;
	private _selectedSlotEnd: Date;
	private _selectedSlotResourceId: string;
	private _currentRangeStart: Date;
	private _currentRangeEnd: Date;
	private _currentDate: Date;
	private _notifyOutputChanged: () => void;
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
		//this will ensure that if the container size changes the updateView function will be called.
		context.mode.trackContainerResize(true);

		this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._container = container;

		this._props = {
			pcfContext: this._context,
			onClickSelectedRecord: this.onClickSelectedRecord.bind(this),
			onClickSlot: this.onClickSelectedSlot.bind(this),
			onRangeChange: this.onRangeChange.bind(this),
			onDateChange: this.onDateChange.bind(this)		
		}

		this._container.style.height = this._context.mode.allocatedHeight !== -1 ? `${(this._context.mode.allocatedHeight - 25).toString()}px` : "100%";
		this._container.style.zIndex = "0";
		
		//set the paging size to 5000
		context.parameters.calendarDataSet.paging.setPageSize(5000);			
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{		

		var dataSet = context.parameters.calendarDataSet

		//if we are in a canvas app we need to resize the map to make sure it fits inside the allocatedHeight
		if (this._context.mode.allocatedHeight !== -1) {
			this._container.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
		}

		if (dataSet.loading) return;

		//if data set has additional pages retrieve them before running anything else
		//do not do this for canvas apps since the loadNextPage is currently broken
		if (this._context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
			dataSet.paging.loadNextPage();
			return;
		}

		this._props.pcfContext = this._context;

		ReactDOM.render(
			React.createElement(
				CalendarControl, this._props
			), 
			this._container
		);	
	}

	public onRangeChange(start: Date, end: Date){
		this._currentRangeStart = start;
		this._currentRangeEnd = end;
		this._selectedAction = "RangeChange";
		this._notifyOutputChanged();
	}

	public onClickSelectedRecord(recordId: string)
	{
		this._selectedRecordId = recordId;
		this._selectedAction = "RecordSelected";
		this._notifyOutputChanged();
	}

	public onClickSelectedSlot(start: Date, end: Date, resourceId: string)
	{
		this._selectedSlotStart = start;
		this._selectedSlotEnd = end;
		this._selectedSlotResourceId = resourceId || "";
		this._selectedAction = "TimeSlotSelected";		
		this._notifyOutputChanged();
	}

	public onDateChange(date: Date)
	{
		this._currentDate = date;
		this._selectedAction = "DateChange";
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		//initially I tried just returning every output variable at once.  
		//DO NOT DO THAT!!!!!!! If you have any output variables that are undefined then any OnChange event code you have will not fire.
		// return {
		// 	selectedSlotStart: this._selectedSlotStart,
		// 	selectedSlotEnd : this._selectedSlotEnd,
		// 	selectedSlotResourceId : this._selectedSlotResourceId,		
		// 	selectedRecordId : this._selectedRecordId,	
		// 	currentRangeStart: this._currentRangeStart,
		// 	currentRangeEnd: this._currentRangeEnd,
		// 	onChangeAction: this._selectedAction		 	
		// };
		
		switch(this._selectedAction)
		{
			case 'RecordSelected':
				return {
					selectedRecordId : this._selectedRecordId,
					onChangeAction: this._selectedAction	
				}
			case 'TimeSlotSelected':
				return {
					selectedSlotStart: this._selectedSlotStart,
					selectedSlotEnd : this._selectedSlotEnd,
					selectedSlotResourceId : this._selectedSlotResourceId,
					onChangeAction: this._selectedAction
				}
			case 'DateChange':
				return {
					currentCalendarDate: this._currentDate,
					onChangeAction: this._selectedAction
				}
			case 'RangeChange': 
			default:
				return {
					currentRangeStart: this._currentRangeStart,
					currentRangeEnd: this._currentRangeEnd,
					onChangeAction: this._selectedAction		
				};
			
		}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}

}