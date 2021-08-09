import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {AzureMap, AzureMapsProvider, IAzureMapOptions, IAzureMapControls, 
    AzureMapDataSourceProvider, AzureMapPopup, AzureMapLayerProvider, IAzureDataSourceChildren, AzureMapFeature} from 'react-azure-maps'
import {data, MapMouseEvent, MapErrorEvent, ControlPosition, 
	ControlOptions, CameraBoundsOptions, PopupOptions} from 'azure-maps-control'
import { Stack} from 'office-ui-fabric-react/lib/Stack';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyleSets, getTheme, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { HoverCard, HoverCardType, IPlainCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { isNumber } from "util";
import atlas = require('azure-maps-control');


export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs> 
}

interface MyWindow extends Window {
	myFunction: Function;
  }

const baseMapOptions: IAzureMapOptions = {    
    zoom: 10, 
	center: [0, 0],
	language: 'en-US',
	style: 'satellite_road_labels'	
}

const azureMapsControls: IAzureMapControls[] = [
    {
        controlName: 'CompassControl',
        options: { position: ControlPosition.TopRight } as ControlOptions
    },
    {
        controlName: 'ZoomControl',
        options: { position: ControlPosition.TopRight } as ControlOptions
    },
    {
        controlName: 'PitchControl',        
        options: { position: ControlPosition.TopRight } as ControlOptions
    },
    {
		controlName: 'StyleControl',
		controlOptions: { mapStyles: ["satellite", "satellite_road_labels", "road", "road_shaded_relief", "night", "grayscale_dark", "grayscale_light"] },
        options: { position: ControlPosition.TopRight } as ControlOptions
    }
];


const loaderComponent = <Spinner styles={{root: {height: '100%'}}} size={SpinnerSize.large} label="Loading..."  />;

const theme = getTheme();

const errorStyles = mergeStyleSets({
	stack: [{
		justifyContent: "center",
		alignItems: "center",
		height: '100%'
	}],
	icon: [{
		fontSize: 50,
		height: 50,
		width: 50,
		margin: '0 25px',
		color: 'red'
	}],
	title: [
		theme.fonts.xLarge,
		{
		  margin: 0,
		  fontWeight: FontWeights.semilight
		}
	  ],
	  subtext: [
		theme.fonts.small,
		{
		  margin: 0,
		  fontWeight: FontWeights.semilight
		}
	  ]	  
});

const invalidRecordsStyle = mergeStyleSets({
	compactCard: {
		display: 'flex',
		cursor: 'text',		
		flexDirection: 'column',
		padding: '10px',
		height: '100%',		
	  },
	  item: {
		textDecoration: 'underline',
		cursor: 'default',
  		color: '#3b79b7'
	  },
	  invalidItem: {
		color: '#333',
		textDecoration: 'none',
	  },
	  title: {
		color: '#333',
		textDecoration: 'none',
		fontWeight: FontWeights.bold	
	  }
});

export const AzureMapsGridControl: React.FC<IProps> = (props) => {	

	const [environmentSettings, setEnvironmentSettings] = React.useState({settings: {}, loading: true, errorTitle: '', errorMessage: ''});
	const [azureMapOptions, setAzureMapOptions] = React.useState(baseMapOptions);
	const [showMap, setShowMap] = React.useState(false);
	const [errorDetails, setErrorDetails] = React.useState({hasError: false, errorTitle: '', errorMessage:''});
	const [popupDetails, setPopupDetails] = React.useState({options: { position: [0,0] } as PopupOptions, properties: {name: '', id: '', entityName: '', description: ''}, isVisible: false});	    
	const [defaultMarkerColor, setDefaultMarkerColor] = React.useState(props.pcfContext.parameters?.defaultPushpinColor?.raw || "#4288f7");	

	const _getKeys = () => {
		let params = props.pcfContext.parameters;
		let dataSet = props.pcfContext.parameters.mapDataSet;

		return { 
			lat: params.latFieldName.raw ? getFieldName(dataSet, params.latFieldName.raw) : "",
			long: params.longFieldName.raw ? getFieldName(dataSet, params.longFieldName.raw) : "",
			name: params.primaryFieldName.raw ? getFieldName(dataSet, params.primaryFieldName.raw) : "",
			description: params.descriptionFieldName.raw ? getFieldName(dataSet, params.descriptionFieldName.raw) : "",
			color: params.pushpinColorField.raw ? getFieldName(dataSet, params.pushpinColorField.raw) : ""
		}
	}
	const [keys, setKeys] = React.useState(_getKeys);

	const _getMarkers = () : {valid: DataSetInterfaces.EntityRecord[], invalid:string[], cameraOptions:CameraBoundsOptions} => {		
		let dataSet = props.pcfContext.parameters.mapDataSet;
		let _invalidRecords: string[] = [];
		let _validRecords: DataSetInterfaces.EntityRecord[] = [];
		var _cameraOptions: CameraBoundsOptions = { padding: 20 };
		let returnData =  {valid: _validRecords, invalid: _invalidRecords, cameraOptions: _cameraOptions}
		//if dataset is empty or the lat/long fields are not defined then end
		if (!dataSet || !keys.lat || !keys.long) {
			return returnData;
		}

		//store location results so that we can utilize them later to get the bounding box for the map		
		let totalRecordCount = dataSet.sortedRecordIds.length;
		
		let locationResults: data.Position[] = [];

		//loop through all the records to create the pushpins
		for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
			var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
			
			var lat = record.getValue(keys.lat) as number;
			var long = record.getValue(keys.long) as number;
			var name = record.getValue(keys.name) as string;

			//if incorrect lat or long values are in the data then continue;
			if (!checkLatitude(lat) || !checkLongitude(long)) 
			{ 	
				//output the incorrect lat/long data so the user could later update the record.
				//console.log(`Cannot add pin for ${name}, Lat: ${lat ? lat.toString() : ''}, Long: ${long ? long.toString() : ''}`);
				returnData.invalid.push(`Name: ${name}, Lat: ${lat ? lat.toString() : ''}, Long: ${long ? long.toString() : ''}`)				
				continue;
			}			
			
			returnData.valid.push(record);			

			// var pushpinLatLong = new Microsoft.Maps.Location(lat, long);
			locationResults.push([long, lat]);
		}
		
		if (_validRecords.length > 0)
		{
			returnData.cameraOptions.bounds = generateBoundingBox(locationResults)
		}

		return returnData;
	}
	const [markers, setMarkers] = React.useState(_getMarkers);

	//Listens for the data set to change then updates the markers.
	React.useEffect(() => {
		if (props.pcfContext.parameters.mapDataSet.loading === false)
		{
			setMarkers(_getMarkers);
		}
	}, [props.pcfContext.parameters.mapDataSet]);

	//This useEffect is an example of one where you want to run something that is async, in this case the
	//retrieveMultipleRecords function but you want to await the results.
    React.useEffect(() => {
        const _getSettings = async() => {
            try{
                await props.pcfContext.webAPI.retrieveMultipleRecords('raw_azuremapsconfig').then(
                    (results) => {
                        if (results.entities.length > 0)
                        {
                            setEnvironmentSettings({settings: results.entities[0], loading: false, errorTitle: '', errorMessage: ''});
                        }
                        else
                        {
							setEnvironmentSettings({
								settings: {}, 								
								loading: false, 
								errorTitle: 'No Settings found for Azure Maps', 
								errorMessage: 
								`Please contact your administror and have then add a record in your system under the Azure Maps Config entity.`
							});
                        }
                    },
                    (error) => {
						setEnvironmentSettings({
							settings: {}, 							 
							loading: false,
							errorTitle: 'Error retrieveing the Azure Maps Settings.',
							errorMessage: error.message
						});
                    }
                );
            }
            catch(error){				
				setEnvironmentSettings({
					settings: {}, 					
					loading: false, 
					errorTitle: 'Error retrieveing the Azure Maps Settings.', 
					errorMessage: error});
            }
        }

        _getSettings();
    }, []);

    React.useEffect(() => {
        if (!environmentSettings.loading){            
			
			if (environmentSettings.errorTitle === '')
			{
				let updatedOptions = {...azureMapOptions, authOptions: _getAuthenticationOptions(environmentSettings.settings)}
				if (isAzureGoverment(environmentSettings.settings)){
					updatedOptions.domain = 'atlas.azure.us';
				}
				setAzureMapOptions(updatedOptions);
			}
			else{
				setErrorDetails({hasError: true, errorTitle: environmentSettings.errorTitle, errorMessage: environmentSettings.errorMessage});
			}
		}
		
	}, [environmentSettings]);
	
	React.useEffect(() => {
		if (azureMapOptions.authOptions){
			setShowMap(true);
		}
	}, 
	[azureMapOptions.authOptions]);

	React.useEffect(()=> {
		if (errorDetails.hasError){
			setShowMap(false);
		}
	}, [errorDetails]);       	
	
	const _getAuthenticationOptions = (settings: any) : any => {
		let authType = settings.raw_authenticationtype;
		var authOptions = {};			

		//load authentication information
		switch(authType){
			case 699720001: //AAD			
				authOptions = {
					authType: atlas.AuthenticationType.aad,					
					clientId: settings?.raw_clientid || '',
					aadAppId: settings?.raw_aadappid || '',
					aadTenant: settings?.raw_aadtenant || '',
					aadInstance: settings?.raw_aadinstance || '',
				}
				break;			
			case 699720002: //Anonymous
				authOptions = {
					authType: atlas.AuthenticationType.anonymous,					
					clientId: settings.raw_clientid || '',					
					getToken: function (resolve: any, reject: any, map: any){
						var setError = (e: any) => setErrorDetails({hasError: true, errorTitle: 'Anonymous Authentication getToken Error', errorMessage: `${e.message}`})
						
						try{
							var userFunction = settings?.raw_anonymousgettokenfunction || '';
							userFunction = userFunction.replace('url', `"${settings?.raw_anonymousurl}"`);																				
							var evalFunction = `(${userFunction})(resolve, reject, map);`																																	
							eval(evalFunction);
						}
						catch(error){
							setError(error);							
						}						
					}																	
				}
				break;			
			default: //subscription key
				authOptions = {
					authType: atlas.AuthenticationType.subscriptionKey,
					subscriptionKey: settings.raw_subscriptionkey
				}
				break;
		}
	
		return authOptions;
	}

	const _openRecord = React.useCallback(() => {
		//event.preventDefault();
		props.pcfContext.navigation.openForm({
			openInNewWindow: true, 
			entityId: popupDetails.properties.id, 
			entityName: popupDetails.properties.entityName 
		});

	}, [popupDetails.properties]);

	const _recordOpen = () => {
		//event.preventDefault();
		props.pcfContext.navigation.openForm({
			openInNewWindow: true, 
			entityId: popupDetails.properties.id, 
			entityName: popupDetails.properties.entityName 
		});

	}

	const _memoizedMarkerRender: IAzureDataSourceChildren = React.useMemo(
        (): any => markers.valid.map(marker => renderPoint(marker, keys, defaultMarkerColor)),
        [markers]
	);

	const _expandingCardProps: IPlainCardProps = {
		onRenderPlainCard: onRenderPlainCard,
		renderData: markers.invalid
	};

    return(	
    <div id="mainDiv">		
        <div id="mapDiv">
			{environmentSettings.loading && loaderComponent}
			{errorDetails.hasError && 
				<Stack horizontal className={errorStyles.stack}>
					<FontIcon iconName="StatusErrorFull" className={errorStyles.icon} />
					<Stack>
						<Label className={errorStyles.title}>{errorDetails.errorTitle}</Label>
						<Label className={errorStyles.subtext}>{errorDetails.errorMessage}</Label>
					</Stack>
				</Stack>}         			
            {showMap && <AzureMapsProvider>
				<AzureMap 
						options={azureMapOptions}
						LoaderComponent={() => loaderComponent}
						cameraOptions={markers.cameraOptions}															
						events={{							
							ready: (e: any) => {
								//console.log('ready', e);
								e.map.setCamera({
									bounds: markers.cameraOptions.bounds, 
									padding: markers.cameraOptions.padding});								
							},					
							error: (e: MapErrorEvent) => {								
								//console.log('error', e);
								//If the map is not currently loaded then assume that this error is coming from an authentication error.
								//Microsoft has decided to throw errors for a lof of things that don't actually affect functionality.
								if (e.map['loaded'] === false)
								{
									setErrorDetails({hasError: true, errorTitle: e.error.name, errorMessage: e.error.message});								
								}
							}
						}}
						controls={azureMapsControls}>
					<AzureMapDataSourceProvider 
						id={"DataSource1"}>						
						<AzureMapLayerProvider
							id={"Layer1"}
							options={{
								radius: 3,
								strokeColor: ['get', 'color'],
								strokeWidth: 4,
								color: "white"
							}}
							type={"BubbleLayer"}
							events={{								
								//this event keeps the popup box open until you hover over another shap or
								//hit the close button on the current popup.
								mousemove: (e: MapMouseEvent) => {
									if (e.shapes && e.shapes.length > 0) {
										setPopupDetails({
											options: getPopupOptions(e), 
											properties: getPopupProperties(e), 
											isVisible: true});			
									}
								  }
							}}							
						></AzureMapLayerProvider>
						{_memoizedMarkerRender}           
              		</AzureMapDataSourceProvider>
					<AzureMapPopup								 					
						isVisible={popupDetails.isVisible}
						options={popupDetails.options}						
						popupContent={<div className="azuremapsgrid-customInfobox">
									<div className="azuremapsgrid-name">{popupDetails.properties.name}</div>
									{popupDetails.properties.description && <div>{popupDetails.properties.description}</div>}
									<div>{popupDetails.options.position![1]}, {popupDetails.options.position![0]}</div>
									<div><a href={`main.aspx?etn=${popupDetails.properties.entityName}&pagetype=entityrecord&id=${popupDetails.properties.id}`} target="_blank">Open Record</a></div>
									</div>}             
            		/>
                </AzureMap>
            </AzureMapsProvider>}
        </div>
        <div id="mapInfoDiv">
			<div>Total Records ({(markers.invalid.length + markers.valid.length).toString()})</div>
			<div className="mapInfoDetails">Valid Locations ({markers.valid.length.toString()})</div>
			<div className="mapInfoDetails">Invalid/Empty Locations (</div>
			<HoverCard type={HoverCardType.plain} plainCardProps={_expandingCardProps} className={invalidRecordsStyle.item}>{markers.invalid.length.toString()}</HoverCard>
			<div>)</div>
        </div>
    </div>
    );
}

const myFunction = () => {
	alert("I am an alert box!");
  }

const isAzureGoverment = (settings: any): boolean => {
	return settings?.raw_azuregovernment === true || false;
}  

const generateBoundingBox = (locationResults: data.Position[]): atlas.data.BoundingBox | undefined => {
		
	if (locationResults.length > 0) {
		locationResults.sort(compareLocationValues('latitude'));
		let minLat = locationResults[0][1];
		let maxLat = locationResults[locationResults.length - 1][1];
		locationResults.sort(compareLocationValues('longitude'));
		let minLong = locationResults[0][0];
		let maxLong = locationResults[locationResults.length - 1][0];

		//let box = Microsoft.Maps.LocationRect.fromEdges(maxLat, minLong, minLat, maxLong);
		return atlas.data.BoundingBox.fromEdges(minLong, minLat, maxLong, maxLat)		
	}
}

const getPopupOptions = (e: MapMouseEvent): PopupOptions => {	
		const prop: any = e.shapes![0]		
		let coordinates = prop.getCoordinates();				
		return {
			closeButton: true,
			position: coordinates,
			pixelOffset: [0, -5],			
			showPointer: true
		}								
}

const getPopupProperties = (e: MapMouseEvent) => {
	const prop: any = e.shapes![0];
	return prop.getProperties();
}

const onRenderPlainCard = (items: string[]): JSX.Element => {
	return (
	items.length > 0 ?	
	  <div className={invalidRecordsStyle.compactCard}>
		<div>Invalid Records</div>
		{items.map((item, index) => <div className={invalidRecordsStyle.invalidItem} key={index}>{item}</div>)}
	  </div>
	  : <div></div>
	);
  };

const renderPoint = (record: DataSetInterfaces.EntityRecord, keys: any, defaultMarkerColor: string) => {        
	return (
	  <AzureMapFeature
		key={record.getRecordId()}
		id={record.getRecordId()}		
		type="Point"				
		coordinate={[record.getValue(keys.long) as number, record.getValue(keys.lat) as number]}		
		properties={{
		  id: record.getRecordId(),
		  entityName: (record as any).getNamedReference().entityName,
		  name: record.getValue(keys.name),
		  description: keys.description && record.getValue(keys.description) ? record.getValue(keys.description) : "",
		  color: keys.color && record.getValue(keys.color) ? record.getValue(keys.color).toString() : defaultMarkerColor
		}}
	  />
	)
  }

const getFieldName = (dataSet: ComponentFramework.PropertyTypes.DataSet ,fieldName: string): string =>  {
	//if the field name does not contain a . then just return the field name
	if (fieldName.indexOf('.') == -1) return fieldName;

	//otherwise we need to determine the alias of the linked entity
	var linkedFieldParts = fieldName.split('.');
	linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
	return linkedFieldParts.join('.');
}

const compareLocationValues = (key: 'latitude' | 'longitude', order: 'asc' | 'desc' = 'asc'): any => {
	return function innerSort([a, b]: data.Position, [c, d]: data.Position): number {
		
		const loc = key === 'latitude' ? {a: b, b: d} : {a: a, b: c};

		let comparison = 0;
		if (loc.a > loc.b) {
			comparison = 1;
		} else if (loc.a < loc.b) {
			comparison = -1;
		}
		return (
			(order === 'desc') ? (comparison * -1) : comparison
		);
	}		
}

const checkLatitude = (lat: any): boolean => {
	//check for null or undefined
	if (!lat) return false;
	
	lat = isNumber(lat) ? lat.toString() : lat;
	let latExpression: RegExp = /^(\+|-)?(?:90(?:(?:\.0{1,10})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,10})?))$/;
	return latExpression.test(lat);		
}

const checkLongitude = (long: any): boolean =>	{
	//check for null or undefined
	if (!long) return false;
	
	long = isNumber(long) ? long.toString() : long;
	let longExpression: RegExp = /^(\+|-)?(?:180(?:(?:\.0{1,10})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,10})?))$/;
	return longExpression.test(long);		
}
