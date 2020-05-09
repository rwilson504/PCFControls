/// <reference path="../node_modules/@types/xrm/index.d.ts" />

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
import { MessageBar, MessageBarType, initializeIcons, IconNames, Fabric } from 'office-ui-fabric-react';

import { isNumber } from "util";
import atlas = require('azure-maps-control');

//define the props that will be passed in
export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>
}

//need to declare the RAW namespace as part of window
//or typescript will complain 
declare global {
    interface Window {
        RAW:any
    }
}

//ensures that the office fabric ui icons are available for use
initializeIcons();

export const BusinessProcessFlowButtonsControl: React.FC<IProps> = (props) => {	
    const [formContext, setFormContext] = React.useState<Xrm.FormContext | undefined>(undefined);


    React.useEffect(() => {
        console.log('form context was updated/added');             
        let win = window.RAW;

        //Let's ensure we have the correct formContext just in case someone switched the records quickly.
        //Need to use ts-ignore because contextInfo.entity id is not currently supported. 
        // @ts-ignore
        if (window.RAW?.formContext.getId() !== props.pcfContext.mode.contextInfo.entityId) return;

        setFormContext(win.formContext);
    }, [window.RAW.formContext]);

    return(
    <Fabric>
        
    </Fabric>);
}