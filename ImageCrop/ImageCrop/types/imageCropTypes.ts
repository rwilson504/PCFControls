import { ReactCropProps } from "react-image-crop";
import { IInputs } from "../generated/ManifestTypes";

export interface IImageCropControlProps extends Partial<ReactCropProps> {
    /** PCF context object */
    context: ComponentFramework.Context<IInputs>;
    /** Unique instance ID for the control */
    instanceid: string;
    /** Height of the control (number or string) */
    height: number;
    onDragStart: (e: PointerEvent) => void;
    onDragEnd: (e: PointerEvent) => void;
    onCropComplete: (results: string) => void;
}