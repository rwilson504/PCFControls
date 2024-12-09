import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { loadResources, Resource } from "./utils";

export class ArcGISMaps implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _viewDiv: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private resourcesLoaded: boolean = false;

    constructor() {}

    public async init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): Promise<void> {
        context.mode.trackContainerResize(true);

        this._context = context;
        this._container = container;
        this._container.style.width = "100%";
        this._container.style.height = "100%";

        // Create the div that will hold the MapView
        this._viewDiv = document.createElement("div");
        this._viewDiv.id = "viewDiv";
        this._viewDiv.style.width = "100%";
        this._viewDiv.style.height = "100%";
        this._container.appendChild(this._viewDiv);

        // Load external resources using the utility function
        await this.loadRequiredResources();

        // Initialize the ArcGIS Map only after resources are loaded
        this.initializeMap();
    }

    private async loadRequiredResources(): Promise<void> {
        const resources: Resource[] = [
            { type: "style", src: "https://js.arcgis.com/4.30/esri/themes/light/main.css" }, // ArcGIS stylesheet
            { type: "script", src: "https://js.arcgis.com/4.30/" } // ArcGIS API
        ];

        await loadResources(resources);
    }

    private initializeMap(): void {
        require(["esri/views/MapView", "esri/WebMap"], (MapView: any, WebMap: any) => {
            const webmap = new WebMap({
                portalItem: {
                    id: "f2e9b762544945f390ca4ac3671cfa72" // Sample WebMap ID
                }
            });

            const view = new MapView({
                map: webmap,
                container: this._viewDiv // Use the created div as the container
            });

            // Optional: Add listeners or other setup as needed
            view.when(() => {
                console.log("Map and View are ready");
            }).catch((error: any) => {
                console.error("Error creating map view: ", error);
            });
        });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Implement any updates to the map view here
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        if (this._container && this._viewDiv) {
            this._container.removeChild(this._viewDiv);
        }
    }
}
