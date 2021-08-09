import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CalendarControl, IProps} from "./CalendarControl"
import * as Color from 'color'
var isHexColor = require('is-hexcolor');

export class Calendar implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _props: IProps;
	private _selectedRecordId: string;
	private _actionRecordSelected: boolean;
	private _selectedSlotStart: Date | undefined;
	private _selectedSlotEnd: Date;
	private _actionSlotSelected: boolean;
	private _selectedSlotResourceId: string;
	private _currentRangeStart: Date;
	private _currentRangeEnd: Date;
	private _currentCalendarDate: Date;
	private _currentCalendarView: string;

	private _updateFromOutput: boolean;
	private _notifyOutputChanged: () => void;
	
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

		//make sure to initialize your private variables that will be return in the getOutputs function.
		// If any of them are undefined then the onChange event for the control in a canvas app will not fire.
		this._currentRangeStart = new Date();
		this._currentRangeEnd = new Date();
		this._currentCalendarView = context.parameters.calendarView?.raw || "month";	
		this._selectedSlotResourceId = '';
		this._selectedRecordId = '';
		this._actionRecordSelected = false;
		this._actionSlotSelected = false;

		this._updateFromOutput = false;

		this._props = {
			pcfContext: this._context,
			onClickSelectedRecord: this.onClickSelectedRecord.bind(this),
			onClickSlot: this.onClickSelectedSlot.bind(this),
			onCalendarChange: this.onDateChange.bind(this),
		}
		
		//add style tag that we will add custom calendar style options to.
		let styleEl = document.createElement('style');
		styleEl.type = 'text/css';
		styleEl.id = 'rbc-calendar-theme-style';
		document.head.appendChild(styleEl);

		if (this._context.mode.allocatedHeight !== -1){
			this._container.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
		}
		else{
			///@ts-ignore
			this._container.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "100%"
		}		
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
		//PERFORMANCE: If the updateView was called from the getOuputs function then do not refresh.
		// Otherwise you will end up calling the render method additional times in canvas app
		// when it is not needed.
		if (this._updateFromOutput){
			this._updateFromOutput = false;
			return;
		}

		var dataSet = context.parameters.calendarDataSet
		
		if (dataSet.loading) return;

		//CANVAS ONLY
		if (context.mode.allocatedHeight !== -1) {
			//if we are in a canvas app we need to resize the map to make sure it fits inside the allocatedHeight
			this._container.style.height = `${(context.mode.allocatedHeight - 25).toString()}px`;

			//Setting the page size in a Canvas app works on the first load of the component.  If you navigate
			// away from the page on which the component is located though the paging get reset to 25 when you
			// navigate back.  In order to fix this we need to reset the paging to the count of the records that
			// will come back and do a reset on the paging.  I believe this is all due to a MS bug.
			dataSet.paging.setPageSize(dataSet.paging.totalResultCount);
		}				

		//MODEL ONLY
		if (context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
			//if data set has additional pages retrieve them before running anything else
			// do not do this for canvas apps since the loadNextPage is currently broken
			dataSet.paging.loadNextPage();
			return;
		}
		
		this._props.pcfContext = context;
		//console.log(`updateView: dataSet.sortedRecordIds.length:  ${context.parameters.calendarDataSet.sortedRecordIds.length}`)

		ReactDOM.render(
			React.createElement(
				CalendarControl, this._props
			), 
			this._container
		);	
	}

	public onClickSelectedRecord(recordId: string)
	{
		this._selectedRecordId = recordId;
		this._actionRecordSelected = true;
		this._notifyOutputChanged();
	}

	public onClickSelectedSlot(start: Date, end: Date, resourceId: string)
	{
		this._selectedSlotStart = start;
		this._selectedSlotEnd = end;
		this._selectedSlotResourceId = resourceId || "";
		this._actionSlotSelected = true;	
		this._notifyOutputChanged();
	}

	public onDateChange(date: Date, rangeStart: Date, rangeEnd: Date, view: string)
	{
		this._currentCalendarDate = date;
		this._currentRangeStart = rangeStart;		
		this._currentRangeEnd = rangeEnd;
		this._currentCalendarView = view;
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{	
		this._updateFromOutput = true;
		let notifyAgain = false;

		var output: IOutputs = {
			currentRangeStart: this._currentRangeStart,
			currentRangeEnd: this._currentRangeEnd,
			currentCalendarDate: this._currentCalendarDate,
			currentCalendarView: this._currentCalendarView,
			actionRecordSelected : this._actionRecordSelected,
			actionSlotSelected : this._actionSlotSelected			
		}
		
		if (this._actionRecordSelected){
			notifyAgain = true;
			output.selectedRecordId = this._selectedRecordId;
			this._actionRecordSelected = false;
		}
		

		if (this._actionSlotSelected)
		{
			notifyAgain = true;
			output.actionSlotSelected = true;
			output.selectedSlotStart = this._selectedSlotStart;
			output.selectedSlotEnd = this._selectedSlotEnd;
			output.selectedSlotResourceId = this._selectedSlotResourceId;
			this._actionSlotSelected = false;
		}
		
		if (notifyAgain){
			this._notifyOutputChanged();
		}

		return output;				
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