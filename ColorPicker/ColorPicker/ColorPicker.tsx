import * as React from "react";
import { TextField} from "office-ui-fabric-react/lib/TextField";
import { ColorPicker } from "office-ui-fabric-react/lib/ColorPicker";
import { Callout, DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import { DefaultButton, IButtonStyles } from 'office-ui-fabric-react/lib/Button';
import { IColor } from 'office-ui-fabric-react/lib/Color'
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import { getTheme, ITheme, IStyle } from "@uifabric/styling";

export interface IColorPickerCompProps {
    inputValue: string,
    isDisabled: boolean,
    isVisible: boolean,
    onColorChange: (color: string) => void,
}

export interface IColorPickerCompState extends React.ComponentState, IColorPickerCompProps{
    //for properties that do not need to be passed from the PCF control to the React control
    //put them in the State as apposed to the Props
    displayColorPicker: boolean,
    colorPickerButtonRef: React.RefObject<HTMLDivElement>
}

//sytle for out Stack
const stackTokens: IStackTokens = { 
    childrenGap: 10, 
    padding: 5 };

//get the theme so we can use it later to style non Office-UI content
const theme: ITheme = getTheme();

export class ColorPickerComp extends React.Component<IColorPickerCompProps, IColorPickerCompState>{
    constructor(props: IColorPickerCompProps){
        super(props);

        //sets the initial state of the component
        this.state = {
            inputValue: props.inputValue,
            isDisabled: props.isDisabled,
            isVisible: props.isVisible,
            onColorChange: props.onColorChange,
            displayColorPicker: false,            
            colorPickerButtonRef: React.createRef()
        };          
    }    

    public render(): JSX.Element {
        //css for the color picker button container
        const colorButtonContainerSytles: React.CSSProperties = {
            border: `1px solid ${theme.semanticColors.inputBorder}`,
            padding: '4px'
        }
        
        //css style for the color button picker
        const colorButtonStyle: IStyle = {
            borderWidth: '1px', 
            borderColor: theme.semanticColors.inputBorder, 
            backgroundColor: this.state.inputValue,                
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

        return(
            <div style={{display: this.props.isVisible ? 'inherit' : 'none'}}>            
            <Stack horizontal tokens={stackTokens}>                                      
                        <div ref={this.state.colorPickerButtonRef} style={colorButtonContainerSytles}>
                            <DefaultButton ariaDescription="Select Color" 
                            styles={colorButtonStyles} 
                            onClick={this._onShowColorPickerClicked}
                            disabled={this.props.isDisabled}/>
                        </div>
                        <Callout
                            gapSpace={0}
                            target={this.state.colorPickerButtonRef.current}
                            onDismiss={this._onShowColorPickerClosed}
                            setInitialFocus={true}
                            hidden={!this.state.displayColorPicker}
                            directionalHint={DirectionalHint.rightCenter}
                            >
                            <ColorPicker color={this.state.inputValue} onChange={this._onChangeColorPicker} />
                        </Callout>             
                        <TextField disabled value={`${this.state.inputValue}`}  />
                </Stack>
            </div>
        );
    }
    
    //called when the color picker button is clicked
    private _onShowColorPickerClicked = () => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
      };

    //called when the color picker callout is closed
    private _onShowColorPickerClosed = () => {
       this.setState({
           displayColorPicker: false,
       });
     };

    //called when the color in the color picker has changed
    private _onChangeColorPicker = (ev: React.SyntheticEvent<HTMLElement>, colorObj: IColor) => {       
        let fullHexColor = `#${colorObj.hex}`;
       this.setState({ inputValue: fullHexColor },
                  () => {
                      //call back to our function in the PCF ts file to update the value in the props there.
                      this.props.onColorChange(fullHexColor);
                  });  
     };       
}
