import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { Crop, PixelCrop, convertToPixelCrop } from "react-image-crop";
import { blankCrop } from "../types/imageCropTypes";
import { stripQuotes } from "../utils/stringUtils";

/**
 * Custom hook to track the image source and apply crop logic on load or failure.
 */
export function useImageSrc(
  context: ComponentFramework.Context<IInputs>,
  imgRef: React.RefObject<HTMLImageElement>,
  defaultCrop: Crop | undefined,
  setCrop: (crop: Crop | undefined) => void,
  setCompletedCrop: (crop: PixelCrop) => void
): string | undefined {
  const rawSrc = stripQuotes(context.parameters.imageInput?.raw || undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(rawSrc);

  useEffect(() => {
    const cleanSrc = stripQuotes(context.parameters.imageInput?.raw || undefined);
    setImageSrc(cleanSrc);

    const img = imgRef.current;
    const fallbackCrop = defaultCrop ?? blankCrop;

    if (!img || !cleanSrc) {
      // No image reference available
      setCrop(undefined);
      setCompletedCrop(convertToPixelCrop({...blankCrop}, 0,0));
      return;
    }

    const applyCrop = () => {
      if (img.complete && img.naturalWidth > 0) {
        // Valid image loaded
        setCrop(defaultCrop);
        setCompletedCrop(
          convertToPixelCrop(fallbackCrop, img.width, img.height)
        );
      } else {
        // Image is missing or broken
        setCrop(undefined);
        setCompletedCrop({
          unit: "px",
          x: 0,
          y: 0,
          width: 0,
          height: 0
        });
      }
    };

    // Try immediately
    applyCrop();

    // Listen for load/error events
    const onLoad = () => applyCrop();
    const onError = () => {
      setCrop(undefined);
      setCompletedCrop(convertToPixelCrop({...blankCrop}, 0,0));
    };

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);

    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [context.parameters.imageInput?.raw, defaultCrop]);

  return imageSrc;
}
