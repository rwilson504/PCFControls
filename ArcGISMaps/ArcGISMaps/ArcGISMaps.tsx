import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";
import {
  ArcgisMap,
  ArcgisSearch,
  ArcgisLegend,
} from "@arcgis/map-components-react";

// // import defineCustomElements to register custom elements with the custom elements registry
// import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";
// import esriConfig from "@arcgis/core/config"
// esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets"

 defineMapElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.30/assets" });

export interface IProps {
  pcfContext: ComponentFramework.Context<IInputs>;
  itemId: string;
}

export const ArcGISMapsControl: React.FC<IProps> = (props: IProps) => {
  //const mapRef = useRef<HTMLArcgisMapElement | null>(null);

  // useEffect(() => {
  //   if (mapRef.current) {
  //     console.log('Map element:', mapRef.current);
  //     // Additional logic to ensure map loads properly
  //   }
  // }, []);

  return (
    <React.StrictMode>
    <ArcgisMap
      //itemId={props.itemId}
      //itemID="209aa768f537468cb5f76f35baa7e013"
      itemId="d5dda743788a4b0688fe48f43ae7beb9"
      onArcgisViewReadyChange={(event) => {
        console.log("ArcGIS View Ready:", event.detail);
      }}
      //basemap={props.pcfContext.parameters.mapBase.raw || "streets"}
      //zoom={props.pcfContext.parameters.zoomDefault.raw || 3}
      //ref={mapRef}
    >
      {/* {props.pcfContext.parameters.searchEnabled.raw && (
        <ArcgisSearch
          position={
            props.pcfContext.parameters.searchPosition.raw || "top-right"
          }
        ></ArcgisSearch>
      )}

      {props.pcfContext.parameters.legendEnabled.raw && (
        <ArcgisLegend
          position={
            props.pcfContext.parameters.legendPosition.raw || "bottom-left"
          }
        ></ArcgisLegend>
      )} */}
    </ArcgisMap>
    </React.StrictMode>
  );
};
