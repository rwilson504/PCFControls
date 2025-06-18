import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { Crop, PixelCrop, convertToPixelCrop } from "react-image-crop";

function stripQuotes(str: string): string {
  if (
    str &&
    str.length > 1 &&
    ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'")))
  ) {
    return str.substring(1, str.length - 1);
  }
  return str;
}

/**
 * Custom hook to track the image source and automatically apply default crop
 * when the image is loaded.
 *
 * @param context The PCF context object
 * @param imgRef Ref to the HTMLImageElement
 * @param defaultCrop The default crop to apply
 * @param setCrop Setter to apply crop
 * @param setCompletedCrop Setter to apply completed pixel crop
 * @returns The current image source string
 */
export function useImageSrc(
  context: ComponentFramework.Context<IInputs>,
  imgRef: React.RefObject<HTMLImageElement>,
  defaultCrop: Crop | undefined,
  setCrop: (crop: Crop) => void,
  setCompletedCrop: (crop: PixelCrop) => void
): string {
  const rawSrc = stripQuotes(context.parameters.imageInput?.raw || "");
  const [imageSrc, setImageSrc] = useState<string>(rawSrc);

  useEffect(() => {
    const cleanSrc = stripQuotes(context.parameters.imageInput?.raw || "");
    setImageSrc(cleanSrc);

    const img = imgRef.current;

    if (!img || !defaultCrop || !cleanSrc) return;

    const applyCropIfReady = () => {
      if (img.complete && img.naturalWidth > 0) {
        setCrop(defaultCrop);
        setCompletedCrop(convertToPixelCrop(defaultCrop, img.width, img.height));
      }
    };

    // Try to apply immediately
    applyCropIfReady();

    // Fallback: wait for image load if needed
    const onLoad = () => {
      applyCropIfReady();
    };

    img.addEventListener("load", onLoad);
    return () => {
      img.removeEventListener("load", onLoad);
    };
  }, [context.parameters.imageInput?.raw, defaultCrop]);

  return imageSrc;
}
