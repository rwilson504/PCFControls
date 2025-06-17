import * as React from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
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
    useBrowserScaling,
    useCropToBase64,
    useKeepSelection,
    useRotation,
    useScaling
} from "../hooks";
import CropWrapper from "./imageCropWrapper";

const ImageCropControl: React.FC<IImageCropControlProps> = (props) => {
    const pcfContext = usePcfContext();
    const [crop, setCrop] = React.useState<Crop>();
    const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
    const imgRef = React.useRef<HTMLImageElement>(null) as React.RefObject<HTMLImageElement>;
    const browserScaling = useBrowserScaling(imgRef);

    // Get the locked property from PCF context
    const locked = useLocked(pcfContext.context);

    // Get the disabled property from PCF context
    const disabled = useDisabled(pcfContext.context);

    // Get the ruleOfThirds property from PCF context
    const ruleOfThirds = useRuleOfThirds(pcfContext.context);

    // Get the circularCrop property from PCF context
    const circularCrop = useCircularCrop(pcfContext.context);

    // Get min/max width/height from PCF context, scaled for browser
    const minWidth = useMinWidth(pcfContext.context, browserScaling);
    const maxWidth = useMaxWidth(pcfContext.context, browserScaling);
    const minHeight = useMinHeight(pcfContext.context, browserScaling);
    const maxHeight = useMaxHeight(pcfContext.context, browserScaling);

    // Get the aspect ratio from PCF context and helper to center crop
    const [aspect, centerCropIfNeeded] = useAspect(pcfContext.context, imgRef, setCrop);
    // Get the keepSelection property from PCF context
    const keepSelection = useKeepSelection(pcfContext.context);

    // Get the image from the PCF context property (should be base64)
    const imageSrc = useImageSrc(pcfContext.context);

    // Get the rotation property from PCF context
    const rotation = useRotation(pcfContext.context);

    // Get the scaling property from PCF context
    const scaling = useScaling(pcfContext.context);

    // Use custom hook to handle crop-to-base64 conversion and callback
    useCropToBase64(imgRef, completedCrop, props.onCropComplete, rotation, scaling);

    // Optionally, recenter crop when aspect changes (already handled in hook)

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
        >
            <img
                ref={imgRef}
                alt="Crop"
                src={imageSrc || ''}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: imageSrc ? 'block' : 'none',
                    transform: `rotate(${rotation}deg) scale(${scaling})`
                }}
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        </CropWrapper>
    );
};

export default ImageCropControl;