import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import { SchedulerApp } from "./schedulerApp";

export class Scheduler implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Handler for new event requests from the Scheduler UI.
     * Passes slotId, start, and end to output for PCF consumers.
     */

    private _container: HTMLDivElement;
    private _calculatedHeight: number;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _instanceId: string;
    private _actionRecordSelected: boolean;
    private _selectedRecordId: string;
    private _currentRangeStart: Date;
    private _currentRangeEnd: Date;
    private _currentSchedulerDate: Date;
    private _currentSchedulerView: string;
    private _updateFromOutput: boolean;
    private _reactRoot: ReactDOM.Root;
    private _actionSlotSelected: boolean;
    private _actionNewEvent: boolean;
    private _selectedSlotId: string;
    private _selectedSlotStart: Date;
    private _selectedSlotEnd: Date;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }

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
        this._instanceId = uuidv4();
        this._reactRoot = ReactDOM.createRoot(this._container);
        this._actionRecordSelected = false;
        this._selectedRecordId = '';
        this._actionSlotSelected = false;
        this._selectedSlotId = '';
        this._actionNewEvent = false;

        if (this._context.mode.allocatedHeight !== -1){
			this._container.style.height = `${(this._context.mode.allocatedHeight).toString()}px`;
		}
		else{
			//@ts-expect-error - we are setting the height of the container to 100% if we are in a model driven app
			this._container.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "100%"
		}
        
        this._container.style.zIndex = "0";
        context.parameters.schedulerDataSet.paging.setPageSize(5000);
    }

    public onDateChange(date: Date, rangeStart: Date, rangeEnd: Date, view: string): void {
        this._currentSchedulerDate = date;
        this._currentRangeStart = rangeStart;
        this._currentRangeEnd = rangeEnd;
        this._currentSchedulerView = view;
        this._notifyOutputChanged();
    }

    public onClickSelectedRecord(recordId: string) {
        this._selectedRecordId = recordId;
        this._actionRecordSelected = true;
        this._notifyOutputChanged();
    }

    public onClickSelectedSlot(slotId: string) {
        this._selectedSlotId = slotId;
        this._actionSlotSelected = true;
        this._notifyOutputChanged();
    }

    public onNewEvent(slotId: string, start: Date, end: Date) {
        this._selectedSlotId = slotId;
        this._selectedSlotStart = start;
        this._selectedSlotEnd = end;
        this._actionNewEvent = true;
        this._notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {

        if (this._updateFromOutput) {
            this._updateFromOutput = false;
            return;
        }

        const dataSet = context.parameters.schedulerDataSet;

        if (this._context.mode.allocatedHeight !== -1){                            
			this._container.style.height = `${(this._context.mode.allocatedHeight).toString()}px`;
		}
		else{
			//@ts-expect-error - we are setting the height of the container to 100% if we are in a model driven app
			this._container.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "100%"
		}

        if (dataSet.loading) return;

        if (this._context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
            dataSet.paging.loadNextPage();
            return;
        }

        //this._pcfContextService.updateContext(context);
        // Render the SchedulerApp with the generated instanceId
        this._reactRoot.render(
            React.createElement(SchedulerApp, {
                context: this._context,
                instanceid: this._instanceId,
                height: this._context.parameters.showSchedulerHeader?.raw == true ? this._context.mode.allocatedHeight - 60 : this._context.mode.allocatedHeight,
                onDateChange: this.onDateChange.bind(this),
                onClickSelectedRecord: this.onClickSelectedRecord.bind(this),
                onClickSelectedSlot: this.onClickSelectedSlot.bind(this),
                onNewEvent: this.onNewEvent.bind(this),
            })
        );
    }

    public getOutputs(): IOutputs {
        this._updateFromOutput = true;
        let notifyAgain = false;

        const output: IOutputs = {
            currentRangeStart: this._currentRangeStart,
            currentRangeEnd: this._currentRangeEnd,
            currentSchedulerDate: this._currentSchedulerDate,
            currentSchedulerView: this._currentSchedulerView,
            actionRecordSelected: this._actionRecordSelected
        }

        if (this._actionRecordSelected) {
            notifyAgain = true;
            output.selectedRecordId = this._selectedRecordId;
            this._actionRecordSelected = false;
        }

        if (this._actionSlotSelected) {
            notifyAgain = true;
            output.selectedSlotId = this._selectedSlotId;
            this._actionSlotSelected = false;
        }

        if (this._actionNewEvent) {
            notifyAgain = true;
            output.selectedSlotId = this._selectedSlotId;
            output.selectedSlotStart = this._selectedSlotStart;
            output.selectedSlotEnd = this._selectedSlotEnd;
            this._actionNewEvent = false;
        }

        if (notifyAgain) {
            this._notifyOutputChanged();
        }
        return output;
    }

    public destroy(): void {
        // Unmount the React app
        this._reactRoot.unmount();
    }
}
