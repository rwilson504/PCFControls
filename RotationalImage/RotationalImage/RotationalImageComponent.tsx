/*
 * @Author: richard.wilson 
 * @Date: 2020-05-09 07:38:17 
 * @Last Modified by: richard.wilson
 * @Last Modified time: 2020-06-20 13:09:57
 */

import * as React from "react";
import {IInputs} from "./generated/ManifestTypes";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const isValidHex  = require('hex-and-rgba').isValidHex;

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    onClickEvent: Function
}

export const RotationalImageComp: React.FC<IProps> = (props) => {
    const [rotation, setRotation] = React.useState(props.pcfContext.parameters.rotation?.raw || 0);
    const [transition, setTransition] = React.useState(props.pcfContext.parameters.rotationTransitionTime?.raw || 0);
    const [heigh, setHeight] = React.useState('');
    const [width, setWidth] = React.useState('');
    const [visibility, setVisibility] = React.useState('');    
    const [background, setBackground] = React.useState('');

    React.useEffect(() => {
        setHeight(props.pcfContext.mode.allocatedHeight !== -1 ? `${props.pcfContext.mode.allocatedHeight.toString()}px` : '100%');
    }, [props.pcfContext.mode.allocatedHeight]);

    React.useEffect(() => {
        setWidth(props.pcfContext.mode.allocatedWidth !== -1 ? `${props.pcfContext.mode.allocatedWidth.toString()}px` : '100%')
    }, [props.pcfContext.mode.allocatedWidth]);

    React.useEffect(() => {
        setVisibility(props.pcfContext.mode.isVisible ? 'block' : 'none')
    }, [props.pcfContext.mode.isVisible]);

    React.useEffect(() => {
        setRotation(props.pcfContext.parameters.rotation?.raw || 0)
    }, [props.pcfContext.parameters.rotation.raw]);

    React.useEffect(() => {
        setTransition(props.pcfContext.parameters.rotationTransitionTime?.raw || 0)
    }, [props.pcfContext.parameters.rotationTransitionTime.raw]);

    React.useEffect(() => {
        let bgColor = props.pcfContext.parameters.color?.raw;
        bgColor = bgColor && isValidHex(bgColor) ? bgColor : 'transparent';

        const bgUrl = props.pcfContext.parameters.image?.raw ? props.pcfContext.parameters.image.raw.replace(/"/g, "") : '';                
        let bgSize = 'contain';
        let bgPosition = 'center center';
        let bgRepeat = 'no-repeat';
        
        switch(props.pcfContext.parameters.imagePosition.raw)
        {
            case "Center":
                bgSize = 'auto';
                break;
            case "Fill":
                bgSize = 'cover';
                break;
            case "Fit":
                bgSize = 'contain';
                break;
            case "Stretch":
                bgSize = '100% 100%';
                break;
            case "Tile":
                bgPosition = 'left top';
                bgRepeat = 'repeat';
                bgSize = 'auto';
                break;                
        }
        setBackground(`url('${bgUrl}') ${bgPosition}/${bgSize} ${bgRepeat} ${bgColor}`)

    }, [props.pcfContext.parameters.color.raw,
        props.pcfContext.parameters.imagePosition.raw,
        props.pcfContext.parameters.image.raw]);

    const onClickHandler = () => {
        props.onClickEvent();
    }

    return (  
        <div style={{
            display: visibility,
            transition: `${transition.toString()}ms linear all`,
            height: heigh,
            width: width,
            transform: `matrix(1, 0, 0, 1, 0, 0) rotate(${rotation}deg)`,
            background: background            
        }} 
        onClick={onClickHandler} />             
    );
}