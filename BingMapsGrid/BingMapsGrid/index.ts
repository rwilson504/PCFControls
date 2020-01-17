/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.d.ts" />

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {Spinner} from 'spin.js'

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class BingMapsGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	
	//contains all the elements for the control
	private _container: HTMLDivElement;
	private _mapDiv: HTMLDivElement;

	//map parameters
	private _bMap: Microsoft.Maps.Map;
	private _bMapOptions: Microsoft.Maps.IViewOptions;
	private _bMapPushpinDefaultColor: string;
	private _bMapInfoBox: Microsoft.Maps.Infobox;
	private _loadingSpinner: Spinner;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	// Event Handler 'refreshData' reference
    private _refreshData: EventListenerOrEventListenerObject;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;

		
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
		
		this._loadingSpinner = new Spinner({length: 0, color: '#004080',radius: 30, scale: 1.5}).spin(this._container);

		this.addBingMapsScriptToHeader(this._context);
		
		// window.setTimeout(() => {}, 1000);
		this._mapDiv = document.createElement("div");
        this._mapDiv.setAttribute("id", "mapDiv");        
		this._container.appendChild(this._mapDiv);
	}

	public initMap(){
		this._bMapPushpinDefaultColor = this._context.parameters.defaultPushpinColor.raw || ""
		this._bMapOptions = {			
			zoom: 10,			
			center: new Microsoft.Maps.Location(0,0),
			mapTypeId: Microsoft.Maps.MapTypeId.aerial			
		};
		
		this._bMap = new Microsoft.Maps.Map(this._mapDiv, this._bMapOptions);
		this._bMapInfoBox = new Microsoft.Maps.Infobox(this._bMap.getCenter(), {visible: false});
		this._bMapInfoBox.setMap(this._bMap);	
	}

	public addBingMapsScriptToHeader(context: any): void {
		var apiKey = context.parameters.bingMapsAPIKey.raw || "";

		let headerScript: HTMLScriptElement = document.createElement("script");
        headerScript.type = 'text/javascript';
        headerScript.id = "BingMapsHeaderScript";
		headerScript.src = `https://www.bing.com/api/maps/mapcontrol?key=${apiKey}`;
		document.head.appendChild(headerScript);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{	
		var self = this;
		var dataSet = context.parameters.mapDataSet;
		
		// check to make sure Maps ojbect has been loaded.
		if (!Microsoft.Maps) {			
			setTimeout(() => {self.updateView(self._context)}, 1000);
			return;
		}
	
		//set the paging size to 5000
		if (dataSet.loading) {
            dataSet.paging.setPageSize(5000);            
            return;
        }

		//if data set has additional pages retrieve them before running anything else
		if (dataSet.paging.hasNextPage) {
			dataSet.paging.loadNextPage();
			return;
        }				

		//set bounding box
		this.populateMap(dataSet);				
	}

	private populateMap(dataSet: ComponentFramework.PropertyTypes.DataSet) {
		//shortcut to parameters
		let params = this._context.parameters;
		
		//initialize the map
		this.initMap();

		var keys = { 
			lat: params.latFieldName.raw ? this.getFieldName(dataSet, params.latFieldName.raw) : "",
			long: params.longFieldName.raw ? this.getFieldName(dataSet, params.longFieldName.raw) : "",
			name: params.primaryFieldName.raw ? this.getFieldName(dataSet, params.primaryFieldName.raw) : "",
			description: params.descriptionFieldName.raw ? this.getFieldName(dataSet, params.descriptionFieldName.raw) : "",
			color: params.pushpinColorField.raw ? this.getFieldName(dataSet, params.pushpinColorField.raw) : ""
		}
		
		//if dataset is empty or the lat/long fields are not defined then end
		if (!dataSet || !keys.lat || !keys.long) {
			return;
		}
		
		//store location results so that we can utilize them later to get the bounding box for the map
		let locationResults : Microsoft.Maps.Location[] = [];

		//loop through all the records to create the pushpins
		for (let i = 0; i < dataSet.sortedRecordIds.length; i++) {
			var recordId = dataSet.sortedRecordIds[i];
			var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
			
			var lat = record.getValue(keys.lat);
			var long = record.getValue(keys.long);
			//if no lat or long information continue to the next record.
			if (!lat || !long) continue;
			var pushpinLatLong = new Microsoft.Maps.Location(lat, long);
			locationResults.push(pushpinLatLong);

			//create new pushpin
			var pushPin = new Microsoft.Maps.Pushpin(pushpinLatLong, {title: record.getValue(keys.name).toString()});
			
			//set metadata for push pin
			pushPin.metadata = {
				title: record.getValue(keys.name),
				description: keys.description && record.getValue(keys.description) ? record.getValue(keys.description) : "",
				entityId: recordId, 
				entityName: dataSet.getTargetEntityType()
			};			

			//set color
			if(keys.color && record.getValue(keys.color)){
				pushPin.setOptions({color: record.getValue(keys.color).toString()})
			}
			else if (this._bMapPushpinDefaultColor){
				pushPin.setOptions({color: this._bMapPushpinDefaultColor})
			}

			//add handlers for pushpin
			Microsoft.Maps.Events.addHandler(pushPin, 'click', this.pushPinInfoBoxOpen.bind(this));
			Microsoft.Maps.Events.addHandler(pushPin, 'mouseover', this.pushPinInfoBoxOpen.bind(this));
			Microsoft.Maps.Events.addHandler(pushPin, 'mouseout', this.pushPinInfoBoxClose.bind(this));
			this._bMap.entities.push(pushPin);
		}
		
		//generate the bounding box for the map to allow user to quickly see the area in which the pins are located.
		this.generateBoundingBox(locationResults);

		this._loadingSpinner.stop();
	}

	private generateBoundingBox(locationResults: Microsoft.Maps.Location[]) {
		
		if (locationResults.length > 0) {
			locationResults.sort(this.compareLocationValues('latitude'));
			let minLat = locationResults[0].latitude;
			let maxLat = locationResults[locationResults.length - 1].latitude;
			locationResults.sort(this.compareLocationValues('longitude'));
			let minLong = locationResults[0].longitude;
			let maxLong = locationResults[locationResults.length - 1].longitude;
			let box = Microsoft.Maps.LocationRect.fromEdges(maxLat, minLong, minLat, maxLong);
			this._bMap.setView({ bounds: box });
		}
	}

	private compareLocationValues(key: 'latitude' | 'longitude', order = 'asc'): any {
		return function innerSort(a: Microsoft.Maps.Location, b:Microsoft.Maps.Location): number {
		  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {			
			return 0;
		  }

		  const loc = key === 'latitude' ? {a: a.latitude, b: b.latitude} : {a: a.longitude, b: b.longitude};
	   
		  let comparison = 0;
		  if (loc.a > loc.b) {
			comparison = 1;
		  } else if (loc.a < loc.b) {
			comparison = -1;
		  }
		  return (
			(order === 'desc') ? (comparison * -1) : comparison
		  );
		};
	}

	public pushPinInfoBoxOpen(e: any): void{
		if (e.target.metadata) {
			var self = this;
			//Set the infobox options with the metadata of the pushpin.
			this._bMapInfoBox.setOptions({
				location: e.target.getLocation(),
				title: e.target.metadata.title,
				description: e.target.metadata.description,
				visible: true,
				actions: [{
					label: 'Open Record',
					eventHandler: function(){
					self._context.navigation.openForm({openInNewWindow: true, entityId: e.target.metadata.entityId, entityName: e.target.metadata.entityName })
					}
				}]
			});
		}
	}

	public pushPinInfoBoxClose(e: any): void{
		this._bMapInfoBox.setOptions({visible: false});
	}

	/**
	 * If a related field is being utilized this will ensure that the correct alias is being used.
	 * @param dataSet 
	 * @param fieldName 
	 */
	private getFieldName(dataSet: ComponentFramework.PropertyTypes.DataSet ,fieldName: string): string {
		//if the field name does not contain a . then just return the field name
		if (fieldName.indexOf('.') == -1) return fieldName;

		//otherwise we need to determine the alias of the linked entity
		var linkedFieldParts = fieldName.split('.');
		linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
		return linkedFieldParts.join('.');
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
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