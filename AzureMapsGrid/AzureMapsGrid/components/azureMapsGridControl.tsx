import * as React from 'react';
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {
  AzureMap,
  AzureMapsProvider,
  IAzureMapOptions,
  IAzureMapControls,
  AzureMapDataSourceProvider,
  AzureMapPopup,
  AzureMapLayerProvider,
  IAzureDataSourceChildren,
  AzureMapFeature,
} from 'react-azure-maps';
import {
  data,
  MapMouseEvent,
  MapErrorEvent,
  ControlPosition,
  ControlOptions,
  PopupOptions,
} from 'azure-maps-control';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyleSets, getTheme, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { HoverCard, HoverCardType, IPlainCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as atlas from 'azure-maps-control';
import { usePcfContext } from '../services/pcfContext';
import { useMapKeys, useMarkers, useEnvironmentSettings } from '../hooks';
import { IAzureMapsGridControlProps, MapKeys, PopupDetails } from '../types';
import {
  isAzureGoverment,
  generateBoundingBox,
  getPopupOptions,
  getPopupProperties,
  checkLatitude,
  checkLongitude,
} from '../utils/helpers';

const baseMapOptions: IAzureMapOptions = {
  zoom: 10,
  center: [0, 0],
  language: 'en-US',
  style: 'satellite_road_labels',
};

const azureMapsControls: IAzureMapControls[] = [
  { controlName: 'CompassControl', options: { position: ControlPosition.TopRight } as ControlOptions },
  { controlName: 'ZoomControl', options: { position: ControlPosition.TopRight } as ControlOptions },
  { controlName: 'PitchControl', options: { position: ControlPosition.TopRight } as ControlOptions },
  {
    controlName: 'StyleControl',
    controlOptions: {
      mapStyles: ['satellite', 'satellite_road_labels', 'road', 'road_shaded_relief', 'night', 'grayscale_dark', 'grayscale_light'],
    },
    options: { position: ControlPosition.TopRight } as ControlOptions,
  },
];

const loaderComponent = <Spinner styles={{ root: { height: '100%' } }} size={SpinnerSize.large} label="Loading..." />;

const theme = getTheme();

const errorStyles = mergeStyleSets({
  stack: [{ justifyContent: 'center', alignItems: 'center', height: '100%' }],
  icon: [{ fontSize: 50, height: 50, width: 50, margin: '0 25px', color: 'red' }],
  title: [theme.fonts.xLarge, { margin: 0, fontWeight: FontWeights.semilight }],
  subtext: [theme.fonts.small, { margin: 0, fontWeight: FontWeights.semilight }],
});

const invalidRecordsStyle = mergeStyleSets({
  compactCard: {
    display: 'flex',
    cursor: 'text',
    flexDirection: 'column',
    padding: '10px',
    height: '100%',
  },
  item: { textDecoration: 'underline', cursor: 'default', color: '#3b79b7' },
  invalidItem: { color: '#333', textDecoration: 'none' },
  title: { color: '#333', textDecoration: 'none', fontWeight: FontWeights.bold },
});

const renderPoint = (record: DataSetInterfaces.EntityRecord, keys: MapKeys, defaultMarkerColor: string) => (
  <AzureMapFeature
    key={record.getRecordId()}
    id={record.getRecordId()}
    type="Point"
    coordinate={[record.getValue(keys.long) as number, record.getValue(keys.lat) as number]}
    properties={{
      id: record.getRecordId(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      entityName: (record as any).getNamedReference().entityName,
      name: record.getValue(keys.name),
      description: keys.description && record.getValue(keys.description) ? record.getValue(keys.description) : '',
      color: keys.color && record.getValue(keys.color) ? record.getValue(keys.color).toString() : defaultMarkerColor,
    }}
  />
);

export const AzureMapsGridControl: React.FC<IAzureMapsGridControlProps> = () => {
  const pcfContext = usePcfContext();
  const [azureMapOptions, setAzureMapOptions] = React.useState(baseMapOptions);
  const [showMap, setShowMap] = React.useState(false);
  const [errorDetails, setErrorDetails] = React.useState({ hasError: false, errorTitle: '', errorMessage: '' });
  const [popupDetails, setPopupDetails] = React.useState<PopupDetails>({
    options: { position: [0, 0] } as PopupOptions,
    properties: { name: '', id: '', entityName: '', description: '' },
    isVisible: false,
  });
  const [defaultMarkerColor] = React.useState(pcfContext.context.parameters?.defaultPushpinColor?.raw || '#4288f7');

  const keys = useMapKeys(pcfContext);
  const markers = useMarkers(pcfContext, keys);
  const environmentSettings = useEnvironmentSettings(pcfContext);

  React.useEffect(() => {
    if (!environmentSettings.loading) {
      if (environmentSettings.errorTitle === '') {
        const updatedOptions = { ...azureMapOptions, authOptions: getAuthenticationOptions(environmentSettings.settings) };
        if (isAzureGoverment(environmentSettings.settings)) {
          updatedOptions.domain = 'atlas.azure.us';
        }
        setAzureMapOptions(updatedOptions);
      } else {
        setErrorDetails({ hasError: true, errorTitle: environmentSettings.errorTitle, errorMessage: environmentSettings.errorMessage });
      }
    }
  }, [environmentSettings]);

  React.useEffect(() => {
    if (azureMapOptions.authOptions) {
      setShowMap(true);
    }
  }, [azureMapOptions.authOptions]);

  React.useEffect(() => {
    if (errorDetails.hasError) {
      setShowMap(false);
    }
  }, [errorDetails]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAuthenticationOptions = (settings: any): any => {
    const authType = settings.raw_authenticationtype;
    let authOptions = {};
    switch (authType) {
      case 699720001:
        authOptions = {
          authType: atlas.AuthenticationType.aad,
          clientId: settings?.raw_clientid || '',
          aadAppId: settings?.raw_aadappid || '',
          aadTenant: settings?.raw_aadtenant || '',
          aadInstance: settings?.raw_aadinstance || '',
        };
        break;
      case 699720002:
        authOptions = {
          authType: atlas.AuthenticationType.anonymous,
          clientId: settings.raw_clientid || '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getToken: function (resolve: any, reject: any, map: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setError = (e: any) => setErrorDetails({ hasError: true, errorTitle: 'Anonymous Authentication getToken Error', errorMessage: `${e.message}` });
            try {
              let userFunction = settings?.raw_anonymousgettokenfunction || '';
              userFunction = userFunction.replace('url', `"${settings?.raw_anonymousurl}"`);
              const evalFunction = `(${userFunction})(resolve, reject, map);`;
              // eslint-disable-next-line no-eval
              eval(evalFunction);
            } catch (error) {
              setError(error);
            }
          },
        };
        break;
      default:
        authOptions = {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: settings.raw_subscriptionkey,
        };
        break;
    }
    return authOptions;
  };

  const openRecord = React.useCallback(() => {
    pcfContext.context.navigation.openForm({
      openInNewWindow: true,
      entityId: popupDetails.properties.id,
      entityName: popupDetails.properties.entityName,
    });
  }, [popupDetails.properties]);

  const memoizedMarkerRender: IAzureDataSourceChildren = React.useMemo(
    () => markers.valid.map((marker) => renderPoint(marker, keys, defaultMarkerColor)),
    [markers]
  );

  const expandingCardProps: IPlainCardProps = {
    onRenderPlainCard: (items: string[]): JSX.Element => (
      items.length > 0 ? (
        <div className={invalidRecordsStyle.compactCard}>
          <div>Invalid Records</div>
          {items.map((item, index) => (
            <div className={invalidRecordsStyle.invalidItem} key={index}>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div></div>
      )
    ),
    renderData: markers.invalid,
  };

  return (
    <div id="mainDiv">
      <div id="mapDiv">
        {environmentSettings.loading && loaderComponent}
        {errorDetails.hasError && (
          <Stack horizontal className={errorStyles.stack}>
            <FontIcon iconName="StatusErrorFull" className={errorStyles.icon} />
            <Stack>
              <Label className={errorStyles.title}>{errorDetails.errorTitle}</Label>
              <Label className={errorStyles.subtext}>{errorDetails.errorMessage}</Label>
            </Stack>
          </Stack>
        )}
        {showMap && (
          <AzureMapsProvider>
            <AzureMap
              options={azureMapOptions}
              LoaderComponent={() => loaderComponent}
              cameraOptions={markers.cameraOptions}
              events={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ready: (e: any) => {
                  e.map.setCamera({ bounds: markers.cameraOptions.bounds, padding: markers.cameraOptions.padding });
                },
                error: (e: MapErrorEvent) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if ((e as any).map['loaded'] === false) {
                    setErrorDetails({ hasError: true, errorTitle: e.error.name, errorMessage: e.error.message });
                  }
                },
              }}
              controls={azureMapsControls}
            >
              <AzureMapDataSourceProvider id={"DataSource1"}>
                <AzureMapLayerProvider
                  id={"Layer1"}
                  options={{ radius: 3, strokeColor: ['get', 'color'], strokeWidth: 4, color: 'white' }}
                  type={"BubbleLayer"}
                  events={{
                    mousemove: (e: MapMouseEvent) => {
                      if (e.shapes && e.shapes.length > 0) {
                        setPopupDetails({ options: getPopupOptions(e), properties: getPopupProperties(e), isVisible: true });
                      }
                    },
                  }}
                ></AzureMapLayerProvider>
                {memoizedMarkerRender}
              </AzureMapDataSourceProvider>
              <AzureMapPopup
                isVisible={popupDetails.isVisible}
                options={popupDetails.options}
                popupContent={
                  <div className="azuremapsgrid-customInfobox">
                    <div className="azuremapsgrid-name">{popupDetails.properties.name}</div>
                    {popupDetails.properties.description && <div>{popupDetails.properties.description}</div>}
                    <div>
                      {popupDetails.options.position![1]}, {popupDetails.options.position![0]}
                    </div>
                    <div>
                      <a href={`main.aspx?etn=${popupDetails.properties.entityName}&pagetype=entityrecord&id=${popupDetails.properties.id}`} target="_blank">
                        Open Record
                      </a>
                    </div>
                  </div>
                }
              />
            </AzureMap>
          </AzureMapsProvider>
        )}
      </div>
      <div id="mapInfoDiv">
        <div>Total Records ({(markers.invalid.length + markers.valid.length).toString()})</div>
        <div className="mapInfoDetails">Valid Locations ({markers.valid.length.toString()})</div>
        <div className="mapInfoDetails">Invalid/Empty Locations(</div>
        <HoverCard type={HoverCardType.plain} plainCardProps={expandingCardProps} className={invalidRecordsStyle.item}>
          {markers.invalid.length.toString()}
        </HoverCard>
        <div>)</div>
      </div>
    </div>
  );
};

export default AzureMapsGridControl;
