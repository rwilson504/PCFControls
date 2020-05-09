/*
 * @Author: richard.wilson 
 * @Date: 2020-05-09 07:38:17 
 * @Last Modified by: richard.wilson
 * @Last Modified time: 2020-05-09 08:01:13
 */

import * as React from "react";
import {IInputs} from "./generated/ManifestTypes";
import { TextField, ITextFieldStyles, ITextFieldStyleProps} from "office-ui-fabric-react/lib/TextField";
import { ColorPicker } from "office-ui-fabric-react/lib/ColorPicker";
import { Callout, DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import { DefaultButton, IButtonStyles } from 'office-ui-fabric-react/lib/Button';
import { IColor } from 'office-ui-fabric-react/lib/Color'
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import { getTheme, IStyle } from "@uifabric/styling";
import { initializeIcons } from '@uifabric/icons';

export interface IColorPickerCompProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    initialColorValue: string,
    onColorChange: (color: string) => void,
}

initializeIcons();

export const ColorPickerComp: React.FC<IColorPickerCompProps> = (props) => {      
    const [colorValue, setColorValue] = React.useState(props.initialColorValue);
    const [colorPickerIsHidden, setColorPickerIsHidden] = React.useState(true);
    const [controlIsVisible, setControlIsVisible] = React.useState(props.pcfContext.mode.isVisible)
    const [controlIsDisabled, setControlIsDisabled] = React.useState(props.pcfContext.mode.isControlDisabled)
    const [theme, setTheme] = React.useState(getTheme);

    const colorPickerButtonRef = React.useRef(null);

    React.useEffect(() => {
        props.onColorChange(colorValue || props.initialColorValue);
    }, [colorValue]);

    React.useEffect(() => {
        setColorValue(props.pcfContext.parameters?.inputValue?.raw || '')
    }, [props.pcfContext.parameters.inputValue.raw]);

    React.useEffect(() => {
        setControlIsDisabled(props.pcfContext.mode.isControlDisabled)
    },[props.pcfContext.mode.isControlDisabled]);

    React.useEffect(() => {
        setControlIsVisible(props.pcfContext.mode.isVisible)
    },[props.pcfContext.mode.isVisible]);

    //sytle for out Stack
    const stackTokens: IStackTokens = { 
        childrenGap: 10, 
        padding: 5 
    };

    const colorButtonContainerSytles: React.CSSProperties = {
        border: `1px solid ${theme.semanticColors.inputBorder}`,
        padding: '4px'
    }
    
    //css style for the color button picker
    const colorButtonStyle: IStyle = {
        borderWidth: '1px', 
        borderColor: theme.semanticColors.inputBorder, 
        backgroundColor: colorValue,                
        minWidth: 40,
        minHeight: 22,
        height: 22
    }

    //css styles for the color picker button
    const colorButtonStyles: IButtonStyles = {            
        root: colorButtonStyle,
        rootHovered: colorButtonStyle,
        rootDisabled: colorButtonStyle
    };

    //style for textbox to mimic disabled style but leave field in read-only mode
    // so that text from field can be copied in browsers that dont allow selection
    // within disabled fields like firefox.
    const colorTextStyle: Partial<ITextFieldStyles> = {
        fieldGroup: {        
            background: theme.semanticColors.disabledBackground,
            borderColor: theme.semanticColors.disabledBorder,            
            selectors: {
                '::after' : {
                    borderColor: theme.semanticColors.disabledBorder,
                    borderWidth: '1px'
                },
                ':hover' : {
                    borderColor: theme.semanticColors.disabledBorder                    
                }         
            }
        },
        field:
        {
            borderColor: theme.semanticColors.disabledBorder,
            color: theme.semanticColors.disabledText
        }
    };    

    //called when the color picker button is clicked
    const _onShowColorPickerClicked = () => {
        setColorPickerIsHidden(!colorPickerIsHidden);        
    };

    //called when the color picker callout is closed
    const _onShowColorPickerClosed = () => {
        setColorPickerIsHidden(true);       
    };

    //called when the color in the color picker has changed
    const _onChangeColorPicker = (ev: React.SyntheticEvent<HTMLElement>, colorObj: IColor) => {       
        let fullHexColor = `#${colorObj.hex}`;
        setColorValue(fullHexColor);
    }

    return(
        <div style={{display: controlIsVisible ? 'inherit' : 'none'}}>            
        <Stack horizontal tokens={stackTokens}>                                      
                    <div ref={colorPickerButtonRef} style={colorButtonContainerSytles}>
                        <DefaultButton ariaDescription="Select Color" 
                        styles={colorButtonStyles} 
                        onClick={_onShowColorPickerClicked}
                        disabled={controlIsDisabled}/>
                    </div>
                    <Callout
                        gapSpace={0}
                        target={colorPickerButtonRef}
                        onDismiss={_onShowColorPickerClosed}
                        setInitialFocus={true}
                        hidden={colorPickerIsHidden}
                        directionalHint={DirectionalHint.rightCenter}
                        >
                        <ColorPicker 
                        color={colorValue} 
                        onChange={_onChangeColorPicker} 
                        alphaSliderHidden={true}                            
                        />
                    </Callout>             
                    <TextField readOnly value={`${colorValue}`} styles={colorTextStyle} />
            </Stack>
        </div>
    );   
}