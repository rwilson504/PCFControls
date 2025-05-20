import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import { SchedulerApp } from "./schedulerApp";

export class Scheduler implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _instanceId: string;
    private _currentRangeStart: Date;
    private _currentRangeEnd: Date;
    private _currentCalendarDate: Date;
    private _updateFromOutput: boolean;


    constructor() { }

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

        this._container.style.height = this._context.mode.allocatedHeight !== -1 ? `${(this._context.mode.allocatedHeight - 25).toString()}px` : "100%";
        this._container.style.zIndex = "0";
        context.parameters.schedulerDataSet.paging.setPageSize(5000);
    }

    public onDateChange(date: Date, rangeStart: Date, rangeEnd: Date, view: string) {
        this._currentCalendarDate = date;
        this._currentRangeStart = rangeStart;
        this._currentRangeEnd = rangeEnd;
        this._notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {

        if (this._updateFromOutput) {
            this._updateFromOutput = false;
            return;
        }

        const dataSet = context.parameters.schedulerDataSet;

        if (this._context.mode.allocatedHeight !== -1) {
            this._container.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
        }

        if (dataSet.loading) return;

        if (this._context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
            dataSet.paging.loadNextPage();
            return;
        }

        // Render the SchedulerApp with the generated instanceId
        ReactDOM.createRoot(this._container).render(
            React.createElement(SchedulerApp, {
                context: this._context,
                instanceid: this._instanceId,
                height: this._context.mode.allocatedHeight
            })
        );
    }

    public getOutputs(): IOutputs {
        this._updateFromOutput = true;
        let notifyAgain = false;

        const output: IOutputs = {
            currentRangeStart: this._currentRangeStart,
            currentRangeEnd: this._currentRangeEnd,
            currentSchedulerDate: this._currentCalendarDate
        }

        if (notifyAgain) {
            this._notifyOutputChanged();
        }
        return output;
    }

    public destroy(): void {
        // Unmount the React app
        ReactDOM.createRoot(this._container).unmount();
    }
}
