import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import {WorldDaylightMap} from 'world-daylight-map';

export interface IWorldDaylightMapCompProps {
    pcfContext: ComponentFramework.Context<IInputs>
}

export const WorldDaylightMapComp: React.FC<IWorldDaylightMapCompProps> = (props) => { 
    return(<div style={{ width: props.pcfContext.mode.allocatedWidth.toString() + 'px', height: props.pcfContext.mode.allocatedHeight.toString() + 'px' }}>
    <WorldDaylightMap 
    options={{
        width: '100%',
        height: '100%',
        controlsPosition: props.pcfContext.parameters.controlsPosition?.raw || 'outer-top',
        controlsScale: props.pcfContext.parameters.controlsScale?.raw || 1,
        font: props.pcfContext.parameters.font?.raw || "'Roboto', sans-serif",
        fontSize: props.pcfContext.parameters.fontSize?.raw || 0,
        isSunshineDisplayed: props.pcfContext.parameters.isSunshineDisplayed?.raw || true
    }}
    />
  </div>);   
}
