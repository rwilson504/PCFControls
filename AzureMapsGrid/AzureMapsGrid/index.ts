import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import { AzureMapsGridApp } from "./azureMapsGridApp";

export class AzureMapsGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _instanceId: string;
  private _reactRoot: ReactDOM.Root;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    context.mode.trackContainerResize(true);
    this._notifyOutputChanged = notifyOutputChanged;
    this._context = context;
    this._container = container;
    this._instanceId = uuidv4();
    this._reactRoot = ReactDOM.createRoot(this._container);

    if (this._context.mode.allocatedHeight !== -1) {
      this._container.style.height = `${this._context.mode.allocatedHeight.toString()}px`;
    } else {
      // @ts-expect-error - rowSpan used in model driven apps
      this._container.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "100%";
    }
    this._container.style.zIndex = "0";
    context.parameters.mapDataSet.paging.setPageSize(5000);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const dataSet = context.parameters.mapDataSet;
    if (dataSet.loading) return;
    if (this._context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
      dataSet.paging.loadNextPage();
      return;
    }

    this._reactRoot.render(
      React.createElement(AzureMapsGridApp, {
        context: this._context,
        instanceid: this._instanceId,
        height: this._context.mode.allocatedHeight,
      })
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    this._reactRoot.unmount();
  }
}
