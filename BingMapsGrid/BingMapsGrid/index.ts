/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Modules/Clustering.d.ts" />

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {Spinner} from 'spin.js'
import { isNumber, isString } from "util";
var isHexColor = require('is-hexcolor');

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class BingMapsGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	
	//contains all the elements for the control
	private _container: HTMLDivElement;
	private _mapDiv: HTMLDivElement;
	private _mapInfoDiv: HTMLDivElement;

	//map parameters
	private _bMap: Microsoft.Maps.Map;
	private _bMapOptions: Microsoft.Maps.IViewOptions;
	private _bMapPushpinDefaultColor: string;
	private _bMapInfoBox: Microsoft.Maps.Infobox;
	private _bMapInfoBoxInvalidRecords: Microsoft.Maps.Infobox; 
	private _bMapScriptIsLoaded: boolean;
	private _bMapIsLoaded: boolean;
	private _bMapIsPopulating: boolean;
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
		//this will ensure that if the container size changes the updateView function will be called.
		context.mode.trackContainerResize(true);

		this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._container = container;
		this._bMapIsLoaded = false;
		
		this._loadingSpinner = new Spinner({
			length: 0, 
			color: '#004080',
			radius: 30, 
			scale: 1.5,
			className: 'bing-maps-spinner'
		}).spin(this._container);

		this.addBingMapsScriptToHeader(this._context);
		
		let mainDiv = document.createElement("div");
		mainDiv.setAttribute("id", "mainDiv");

		this._mapDiv = document.createElement("div");
		this._mapDiv.setAttribute("id", "mapDiv");
		//we need to set the map height.  If the allocated height is not -1 then we are in a canvas app 
		//and we need to set the heigh based upon the allocated height of the container.
		this._mapDiv.style.height = this._context.mode.allocatedHeight !== -1 ? `${(this._context.mode.allocatedHeight - 25).toString()}px` : "calc(100% - 25px)";
		this._mapInfoDiv = document.createElement("div");
		this._mapInfoDiv.setAttribute("id", "mapInfoDiv");
		mainDiv.appendChild(this._mapDiv);
		mainDiv.appendChild(this._mapInfoDiv);

		this._container.appendChild(mainDiv);

		//set the paging size to 5000
		context.parameters.mapDataSet.paging.setPageSize(5000);

		this.initMap();
	}

	public initMap(){

		var self = this;
		if (!this._bMapScriptIsLoaded) {			
			setTimeout(() => {self.initMap()}, 1000);
			return;
		}		

		this._bMapPushpinDefaultColor = isHexColor(this._context.parameters.defaultPushpinColor?.raw || '') ? this._context.parameters.defaultPushpinColor.raw as string : '';
		this._bMapOptions = {			
			zoom: 0,			
			center: new Microsoft.Maps.Location(0,0),
			mapTypeId: Microsoft.Maps.MapTypeId.aerial			
		};
		
		this._bMap = new Microsoft.Maps.Map(this._mapDiv, this._bMapOptions);
		this._bMapInfoBox = new Microsoft.Maps.Infobox(this._bMap.getCenter(), {visible: false});
		this._bMapInfoBoxInvalidRecords = new Microsoft.Maps.Infobox(this._bMap.getCenter(), {title: 'Invalid Locations', visible: false, showPointer: true});
		this._bMapInfoBox.setMap(this._bMap);
		this._bMapInfoBoxInvalidRecords.setMap(this._bMap);

		this._bMapIsLoaded = true;
	}

	public addBingMapsScriptToHeader(context: any): void {
		var apiKey = context.parameters.bingMapsAPIKey.raw || "";

		let headerScript: HTMLScriptElement = document.createElement("script");
        headerScript.type = 'text/javascript';
		headerScript.id = "BingMapsHeaderScript";
		headerScript.async = true;
		headerScript.defer = true;
		headerScript.src = `https://www.bing.com/api/maps/mapcontrol?key=${apiKey}`;
		headerScript.onload = () => {
			this._bMapScriptIsLoaded = true;
		}
		
		this._container.appendChild(headerScript);
	}	

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{	
		var dataSet = context.parameters.mapDataSet;

		//if we are in a canvas app we need to resize the map to make sure it fits inside the allocatedHeight
		if (this._context.mode.allocatedHeight !== -1) {
			this._mapDiv.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
		}				

		if (dataSet.loading) return;

		//if data set has additional pages retrieve them before running anything else
		if (dataSet.paging.hasNextPage) {
			dataSet.paging.loadNextPage();
			return;
		}		
				
		//populate the map
		this.populateMap();				
	}

	private populateMap() {
		//wait for the map script to load
		var self = this;
		if (!this._bMapIsLoaded){			
			setTimeout(() => {self.populateMap()}, 1000);
			return;
		}

		//prevent the double run of updateView to update the map a second time while it's loading.
		if (this._bMapIsPopulating) return;
		this._bMapIsPopulating = true;

		let dataSet = this._context.parameters.mapDataSet;
		//shortcut to parameters
		let params = this._context.parameters;

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
		let totalRecordCount = dataSet.sortedRecordIds.length;
		let invalidRecords: string[] = [];

		let pushPins: Microsoft.Maps.Pushpin[] = [];
		//loop through all the records to create the pushpins
		for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
			var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
			
			var lat = record.getValue(keys.lat);
			var long = record.getValue(keys.long);
			var name = record.getValue(keys.name);

			//if incorrect lat or long values are in the data then continue;
			if (!this.checkLatitude(lat) || !this.checkLongitude(long)) 
			{ 	
				//add the invalid/empty record to a string array so we can show it in an info box.		
				invalidRecords.push(`Name: ${name}, Lat: ${lat ? lat.toString() : ''}, Long: ${long ? long.toString() : ''}`);
				continue;
			}

			var pushpinLatLong = new Microsoft.Maps.Location(lat, long);
			locationResults.push(pushpinLatLong);

			//create new pushpin
			var pushPin = new Microsoft.Maps.Pushpin(pushpinLatLong, {title: name.toString()});
			
			//set metadata for push pin
			pushPin.metadata = {
				title: name,
				description: keys.description && record.getValue(keys.description) ? record.getValue(keys.description) : "",
				entityId: recordId, 
				entityName: dataSet.getTargetEntityType()
			};			

			//set color
			if(keys.color && isHexColor(record.getValue(keys.color))){
				pushPin.setOptions({color: record.getValue(keys.color).toString()})
			}
			else if (this._bMapPushpinDefaultColor){
				pushPin.setOptions({color: this._bMapPushpinDefaultColor})
			}

			//add handlers for pushpin
			Microsoft.Maps.Events.addHandler(pushPin, 'click', this.pushPinInfoBoxOpen.bind(this));
			Microsoft.Maps.Events.addHandler(pushPin, 'mouseover', this.pushPinInfoBoxOpen.bind(this));
			Microsoft.Maps.Events.addHandler(pushPin, 'mouseout', this.pushPinInfoBoxClose.bind(this));
			
			pushPins.push(pushPin);
		}
		
		//generate the bounding box for the map to allow user to quickly see the area in which the pins are located.
		this.generateBoundingBox(locationResults);		
		
		//set the invalid record info box description with the list of our invalid records.
		this._bMapInfoBoxInvalidRecords.setOptions({description: invalidRecords.join('<br />')});
		
		//add record information to the footer
		this._mapInfoDiv.innerHTML = `Total Records (${totalRecordCount.toString()}) Valid Locations (${locationResults.length.toString()}) Invalid/Empty Locations (<span title="Click to View Invalid/Empty record data." id="invalidSpan">${invalidRecords.length.toString()}</span>)`;
		document.getElementById('invalidSpan')?.addEventListener("click", this.showInvalidRecordInfoBox.bind(this));
		
		Microsoft.Maps.loadModule('Microsoft.Maps.Clustering', () => {
			var clusterLayer = new Microsoft.Maps.ClusterLayer(pushPins, {
				clusteredPinCallback: this.clusterPinCustomization.bind(this),
				clusteringEnabled: params.clusteringEnabled?.raw?.toLowerCase() === 'true' ? true : false,
				gridSize: params.clusterGridSize.raw || 45,
				clusterPlacementType: params.clusterPlacement?.raw === "FirstLocation" ? Microsoft.Maps.ClusterPlacementType.FirstLocation : Microsoft.Maps.ClusterPlacementType.MeanAverage
			});
			this._bMap.layers.clear();
			this._bMap.layers.insert(clusterLayer);
			//allow the map to update again if the updateView is called
			this._bMapIsPopulating = false;
			//stop spinner
			this._loadingSpinner.stop();
		})					
	}

	private clusterPinCustomization(cluster: Microsoft.Maps.ClusterPushpin)
	{
		var clusterColor = this._context.parameters.clusterPushpinColor.raw || '';
		if (clusterColor && isHexColor(clusterColor))
		{
			cluster.setOptions({color: clusterColor});
		}
		else if (this._bMapPushpinDefaultColor){
			cluster.setOptions({color: this._bMapPushpinDefaultColor});
		}	
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

	private checkLatitude(lat: any): boolean 
	{
		//check for null or undefined
		if (!lat) return false;
		
		lat = isNumber(lat) ? lat.toString() : lat;
		let latExpression: RegExp = /^(\+|-)?(?:90(?:(?:\.0{1,10})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,10})?))$/;
		return latExpression.test(lat);		
	}

	private checkLongitude(long: any): boolean
	{
		//check for null or undefined
		if (!long) return false;
		
		long = isNumber(long) ? long.toString() : long;
		let longExpression: RegExp = /^(\+|-)?(?:180(?:(?:\.0{1,10})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,10})?))$/;
		return longExpression.test(long);		
	}

	public showInvalidRecordInfoBox(e: Event): void {
		let boundingBox = this._bMap.getBounds();

		let infoboxOptions: Microsoft.Maps.IInfoboxOptions = {visible: true, 
			location: new Microsoft.Maps.Location(boundingBox.getSouth(), this._bMap.getCenter().longitude),
			maxHeight: this._bMap.getHeight() - 20,
			maxWidth: this._bMap.getWidth() - 20};

		this._bMapInfoBoxInvalidRecords.setOptions(infoboxOptions);
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