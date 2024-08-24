import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";

//pull resource from local path rather than CDN this is to ensure that the resource is available offline
//import { setArcgisAssetPath as setMapAssetPath } from "@arcgis/map-components/dist/components";
//setMapAssetPath(`${location.origin}${location.pathname}assets`);


import {
  ArcgisMap,
  ArcgisScene,
  ArcgisSearch,
  ArcgisLegend,
  ArcgisZoom
} from "@arcgis/map-components-react";

export interface IProps {
  pcfContext: ComponentFramework.Context<IInputs>;
  itemId: string;
}

export const ArcGISMapsControl: React.FC<IProps> = (props: IProps) => {
  return (
    <ArcgisMap itemId={props.itemId} onArcgisViewReadyChange={(event) => {}}>
      {props.pcfContext.parameters.searchEnabled.raw && (
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
        
      )}
    </ArcgisMap>
  );
};
