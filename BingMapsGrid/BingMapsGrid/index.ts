/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Modules/Clustering.d.ts" />

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {Spinner} from 'spin.js'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const isHexColor = require('is-hexcolor');

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
	private _updateFromOutput: boolean;
	private _selectedRecordId: string;
	private _selectedRecordType: string;
	
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
		this._bMapScriptIsLoaded = false;
		this._selectedRecordId = '';
		this._selectedRecordType = '';
		
		this._loadingSpinner = new Spinner({
			length: 0, 
			color: '#004080',
			radius: 30, 
			scale: 1.5,
			className: 'bing-maps-spinner'
		}).spin(this._container);

		this.addBingMapsScriptToHeader(this._context);
		
		const mainDiv = document.createElement("div");
		mainDiv.setAttribute("id", "mainDiv");

		this._mapDiv = document.createElement("div");
		this._mapDiv.setAttribute("id", "mapDiv");
		//we need to set the map height.  If the allocated height is not -1 then we are in a canvas app 
		//and we need to set the heigh based upon the allocated height of the container.
		if (this._context.mode.allocatedHeight !== -1){
			this._mapDiv.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
		}
		else{
			///@ts-expect-error need to set rowspan
			this._mapDiv.style.height = this._context.mode?.rowSpan ? `${(this._context.mode.rowSpan * 1.5).toString()}em` : "calc(100% - 25px)"
		}		
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

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		//even though the script has loaded we still need to check that the namespace has been loaded into global.
		if (!self._bMapScriptIsLoaded || !globalThis.Microsoft || !globalThis.Microsoft.Maps || !globalThis.Microsoft.Maps.Location) {			
			setTimeout(() => {self.initMap()}, 1000);
			return;
		}		

		self._bMapPushpinDefaultColor = isHexColor(self._context.parameters.defaultPushpinColor?.raw || '') ? self._context.parameters.defaultPushpinColor.raw as string : '';
		self._bMapOptions = {			
			zoom: 0,			
			center: new globalThis.Microsoft.Maps.Location(0,0),
			mapTypeId: globalThis.Microsoft.Maps.MapTypeId.aerial			
		};
		
		self._bMap = new globalThis.Microsoft.Maps.Map(self._mapDiv, self._bMapOptions);
		self._bMapInfoBox = new globalThis.Microsoft.Maps.Infobox(self._bMap.getCenter(), {visible: false});
		self._bMapInfoBoxInvalidRecords = new globalThis.Microsoft.Maps.Infobox(self._bMap.getCenter(), {title: 'Invalid Locations', visible: false, showPointer: true});
		self._bMapInfoBox.setMap(self._bMap);
		self._bMapInfoBoxInvalidRecords.setMap(self._bMap);

		self._bMapIsLoaded = true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public addBingMapsScriptToHeader(context: any): void {
		const apiKey = context.parameters.bingMapsAPIKey.raw || "";

		const headerScript: HTMLScriptElement = document.createElement("script");
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
		if (this._updateFromOutput){
			this._updateFromOutput = false;
			return;
		}

		const dataSet = context.parameters.mapDataSet;

		//if we are in a canvas app we need to resize the map to make sure it fits inside the allocatedHeight
		if (this._context.mode.allocatedHeight !== -1) {
			this._mapDiv.style.height = `${(this._context.mode.allocatedHeight - 25).toString()}px`;
		}				

		if (dataSet.loading) return;

		//if data set has additional pages retrieve them before running anything else
		if (context.mode.allocatedHeight === -1 && dataSet.paging.hasNextPage) {
			dataSet.paging.loadNextPage();
			return;
		}		
				
		//populate the map
		this.populateMap();				
	}

	private populateMap() {
		//wait for the map script to load
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		if (!self._bMapIsLoaded){			
			setTimeout(() => {self.populateMap()}, 1000);
			return;
		}

		//prevent the double run of updateView to update the map a second time while it's loading.
		if (self._bMapIsPopulating) return;
		self._bMapIsPopulating = true;

		const dataSet = self._context.parameters.mapDataSet;
		//shortcut to parameters
		const params = self._context.parameters;

		const keys = { 
			id: params?.idFieldName?.raw ? self.getFieldName(dataSet, params.idFieldName.raw) : "",
			recordType: params?.recordTypeFieldName?.raw ? self.getFieldName(dataSet, params.recordTypeFieldName.raw) : "",
			lat: params?.latFieldName?.raw ? self.getFieldName(dataSet, params.latFieldName.raw) : "",
			long: params?.longFieldName?.raw ? self.getFieldName(dataSet, params.longFieldName.raw) : "",
			name: params?.primaryFieldName?.raw ? self.getFieldName(dataSet, params.primaryFieldName.raw) : "",
			description: params?.descriptionFieldName?.raw ? self.getFieldName(dataSet, params.descriptionFieldName.raw) : "",
			color: params?.pushpinColorField?.raw ? self.getFieldName(dataSet, params.pushpinColorField.raw) : ""
		}
		
		//if dataset is empty or the lat/long fields are not defined then end
		if (!dataSet || !keys.lat || !keys.long) {
			return;
		}

		//store location results so that we can utilize them later to get the bounding box for the map
		const locationResults : globalThis.Microsoft.Maps.Location[] = [];
		const totalRecordCount = dataSet.sortedRecordIds.length;
		const invalidRecords: string[] = [];

		const pushPins: globalThis.Microsoft.Maps.Pushpin[] = [];
		//loop through all the records to create the pushpins
		for (let i = 0; i < totalRecordCount; i++) {
			const recordId = dataSet.sortedRecordIds[i];
			const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
			
			const lat = record.getValue(keys.lat);
			const long = record.getValue(keys.long);
			const name = record.getValue(keys.name);

			//if incorrect lat or long values are in the data then continue;
			if (!self.checkLatitude(lat) || !self.checkLongitude(long)) 
			{ 	
				//add the invalid/empty record to a string array so we can show it in an info box.		
				invalidRecords.push(`Name: ${name}, Lat: ${lat ? lat.toString() : ''}, Long: ${long ? long.toString() : ''}`);
				continue;
			}

			const pushpinLatLong = new globalThis.Microsoft.Maps.Location(lat, long);
			locationResults.push(pushpinLatLong);

			//create new pushpin
			const pushPin = new globalThis.Microsoft.Maps.Pushpin(pushpinLatLong, {title: name.toString()});
			
			//set metadata for push pin
			pushPin.metadata = {
				title: name,
				description: keys.description && record.getValue(keys.description) ? record.getValue(keys.description) : "",
				entityId: keys.id && record.getValue(keys.id) ? record.getValue(keys.id) : recordId, 
				entityName: keys.recordType && record.getValue(keys.recordType) ? record.getValue(keys.recordType) : dataSet.getTargetEntityType()
			};			

			//set color
			if(keys.color && isHexColor(record.getValue(keys.color))){
				pushPin.setOptions({color: record.getValue(keys.color).toString()})
			}
			else if (self._bMapPushpinDefaultColor){
				pushPin.setOptions({color: self._bMapPushpinDefaultColor})
			}

			//add handlers for pushpin
			globalThis.Microsoft.Maps.Events.addHandler(pushPin, 'click', self.pushPinInfoBoxOpen.bind(self));
			globalThis.Microsoft.Maps.Events.addHandler(pushPin, 'mouseover', self.pushPinInfoBoxOpen.bind(self));
			globalThis.Microsoft.Maps.Events.addHandler(pushPin, 'mouseout', self.pushPinInfoBoxClose.bind(self));
			
			pushPins.push(pushPin);
		}
		
		//generate the bounding box for the map to allow user to quickly see the area in which the pins are located.
		self.generateBoundingBox(locationResults);		
		
		//set the invalid record info box description with the list of our invalid records.
		self._bMapInfoBoxInvalidRecords.setOptions({description: invalidRecords.join('<br />')});
		
		//add record information to the footer
		self._mapInfoDiv.innerHTML = `Total Records (${totalRecordCount.toString()}) Valid Locations (${locationResults.length.toString()}) Invalid/Empty Locations (<span title="Click to View Invalid/Empty record data." id="invalidSpan">${invalidRecords.length.toString()}</span>)`;
		document.getElementById('invalidSpan')?.addEventListener("click", self.showInvalidRecordInfoBox.bind(self));
		
		globalThis.Microsoft.Maps.loadModule('Microsoft.Maps.Clustering', () => {
			const clusterLayer = new globalThis.Microsoft.Maps.ClusterLayer(pushPins, {
				clusteredPinCallback: self.clusterPinCustomization.bind(self),
				clusteringEnabled: params.clusteringEnabled?.raw?.toLowerCase() === 'true' ? true : false,
				gridSize: params.clusterGridSize.raw || 45,
				clusterPlacementType: params.clusterPlacement?.raw === "FirstLocation" ? globalThis.Microsoft.Maps.ClusterPlacementType.FirstLocation : globalThis.Microsoft.Maps.ClusterPlacementType.MeanAverage
			});
			self._bMap.layers.clear();
			self._bMap.layers.insert(clusterLayer);
			//allow the map to update again if the updateView is called
			self._bMapIsPopulating = false;
			//stop spinner
			self._loadingSpinner.stop();
		})					
	}

	private clusterPinCustomization(cluster: Microsoft.Maps.ClusterPushpin)
	{
		const clusterColor = this._context.parameters.clusterPushpinColor.raw || '';
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
			const minLat = locationResults[0].latitude;
			const maxLat = locationResults[locationResults.length - 1].latitude;
			locationResults.sort(this.compareLocationValues('longitude'));
			const minLong = locationResults[0].longitude;
			const maxLong = locationResults[locationResults.length - 1].longitude;
			const box = globalThis.Microsoft.Maps.LocationRect.fromEdges(maxLat, minLong, minLat, maxLong);
			this._bMap.setView({ bounds: box });
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private compareLocationValues(key: 'latitude' | 'longitude', order = 'asc'): any {
		return function innerSort(a: Microsoft.Maps.Location, b:Microsoft.Maps.Location): number {
		// eslint-disable-next-line no-prototype-builtins
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public pushPinInfoBoxOpen(e: any): void{
		if (e.target.metadata) {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const self = this;
			//Set the infobox options with the metadata of the pushpin.
			this._bMapInfoBox.setOptions({
				location: e.target.getLocation(),
				title: e.target.metadata.title,
				description: e.target.metadata.description,
				visible: true,
				actions: [{
					label: 'Open Record',
					eventHandler: function(){						
						if (self._context.mode.allocatedHeight === -1)
						{
							self._context.navigation.openForm({openInNewWindow: true, entityId: e.target.metadata.entityId, entityName: e.target.metadata.entityName })
						}
						self._selectedRecordType = e.target.metadata.entityName;
						self._selectedRecordId = e.target.metadata.entityId;
						self._notifyOutputChanged();
					}
				}]
			});
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		const linkedFieldParts = fieldName.split('.');
		linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
		return linkedFieldParts.join('.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private checkLatitude(lat: any): boolean 
	{
		//check for null or undefined
		if (!lat) return false;
		
		lat = typeof lat === "number" ? lat.toString() : lat;
		const latExpression: RegExp = /^(\+|-)?(?:90(?:(?:\.0{1,100})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,100})?))$/;
		return latExpression.test(lat);		
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private checkLongitude(long: any): boolean
	{
		//check for null or undefined
		if (!long) return false;
		
		long = typeof long === "number" ? long.toString() : long;
		const longExpression: RegExp = /^(\+|-)?(?:180(?:(?:\.0{1,100})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,100})?))$/;
		return longExpression.test(long);		
	}

	public showInvalidRecordInfoBox(e: Event): void {
		const boundingBox = this._bMap.getBounds();

		const infoboxOptions: globalThis.Microsoft.Maps.IInfoboxOptions = {visible: true, 
			location: new globalThis.Microsoft.Maps.Location(boundingBox.getSouth(), this._bMap.getCenter().longitude),
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
		this._updateFromOutput = true;
		const notifyAgain = false;

		return {
			selectedRecordId: this._selectedRecordId || '',
			selectedRecordType: this._selectedRecordType || ''
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