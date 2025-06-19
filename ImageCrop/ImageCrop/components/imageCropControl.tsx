import * as React from "react";
import { convertToPixelCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { usePcfContext } from "../services/pcfContext";
import { IImageCropControlProps } from "../types/imageCropTypes";
import {
    useImageSrc,
    useMinWidth,
    useMaxWidth,
    useMinHeight,
    useMaxHeight,
    useAspect,
    useLocked,
    useRuleOfThirds,
    useCircularCrop,
    useDisabled,
    useCropToBase64,
    useKeepSelection,
    useRotation,
    useScaling,
    useDefaultCrop
} from "../hooks";
import CropWrapper from "./imageCropWrapper";

const ImageCropControl: React.FC<IImageCropControlProps> = (props) => {
    // Get the PCF context using the custom hook
    const pcfContext = usePcfContext();
    // State to hold the completed crop object, initialized as undefined
    const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
    // Crop state for the image, initialized as undefined
    const [crop, setCrop] = React.useState<Crop>();
    // Reference to the image element for scaling and cropping
    const imgRef = React.useRef<HTMLImageElement>(null) as React.RefObject<HTMLImageElement>;
    //const appScaling = useResponsiveAppScaling(pcfContext.context, imgRef);
    // Get the locked property from PCF context
    const locked = useLocked(pcfContext.context);
    // Get the disabled property from PCF context
    const disabled = useDisabled(pcfContext.context);
    // Get the ruleOfThirds property from PCF context
    const ruleOfThirds = useRuleOfThirds(pcfContext.context);
    // Get the circularCrop property from PCF context
    const circularCrop = useCircularCrop(pcfContext.context);
    // Get min/max width/height from PCF context, scaled for browser
    const minWidth = useMinWidth(pcfContext.context);
    const maxWidth = useMaxWidth(pcfContext.context);
    const minHeight = useMinHeight(pcfContext.context);
    const maxHeight = useMaxHeight(pcfContext.context);
    // Get the aspect ratio from PCF context and helper to center crop
    const [aspect] = useAspect(pcfContext.context, imgRef, setCrop);
    // Get the keepSelection property from PCF context
    const keepSelection = useKeepSelection(pcfContext.context);
    // Get the default crop object (not a hook)
    const defaultCrop = useDefaultCrop(pcfContext.context);
    // Get the image from the PCF context property (should be base64)
    const imageSrc = useImageSrc(pcfContext.context, imgRef, defaultCrop, setCrop, setCompletedCrop);
    // Get the rotation property from PCF context
    const rotation = useRotation(pcfContext.context);
    // Get the scaling property from PCF context
    const scaling = useScaling(pcfContext.context);
    // Use custom hook to handle crop-to-base64 conversion and callback
    useCropToBase64(imgRef, completedCrop, props.onCropComplete, rotation, scaling, circularCrop);

    return (
        <CropWrapper
            crop={crop}
            onChange={(c: Crop) => setCrop(c)}
            onDragStart={(e: PointerEvent) => props.onDragStart(e)}
            onDragEnd={(e: PointerEvent) => props.onDragEnd(e)}
            onComplete={(c: PixelCrop) => setCompletedCrop(c)}
            locked={locked}
            disabled={disabled}
            ruleOfThirds={ruleOfThirds}
            circularCrop={circularCrop}
            minWidth={minWidth}
            maxWidth={maxWidth}
            minHeight={minHeight}
            maxHeight={maxHeight}
            aspect={aspect}
            keepSelection={keepSelection}
            style={{ display: imageSrc && pcfContext.isVisible() ? 'block' : 'none', }}
        >
            <img
                ref={imgRef}
                alt="Crop"
                src={imageSrc}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    transform: `rotate(${rotation}deg) scale(${scaling})`
                }}
            />
        </CropWrapper>
    );
};

export default ImageCropControl;