import { useState, useEffect, RefObject,MutableRefObject } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { centerAspectCrop } from "../utils/cropUtils";
import { Crop } from "react-image-crop";

/**
 * Custom hook to track the aspect property from PCF context and update when it changes.
 * If aspect is set, will return the aspect and a function to center the crop.
 * @param context The PCF context object
 * @param imgRef Optional image ref to auto-center crop when aspect changes
 * @param setCrop Optional setter to update crop state
 * @param imageLoadedRef Optional ref to indicate if the image has loaded
 * @returns [aspect, centerCropIfNeeded]
 */
export function useAspect(
  context: ComponentFramework.Context<IInputs>,
  imgRef: React.RefObject<HTMLImageElement | null>,
  setCrop: (crop: Crop) => void
): [number | undefined, () => void] {
  const getAspect = () => {
    const raw = context.parameters.aspect?.raw;
    if (raw === undefined || raw === null) return undefined;
    const num = Number(raw);
    return isNaN(num) ? undefined : num;
  };

  const [aspect, setAspect] = useState<number | undefined>(getAspect());

  // Recalculate aspect and re-center crop when aspect changes and image is loaded
  useEffect(() => {    
    const currentAspect = getAspect();
    setAspect(currentAspect);

    if (!currentAspect || currentAspect === 0) return;

    if (imgRef?.current && setCrop) {
      const img = imgRef.current;
      const newCrop = centerAspectCrop(img.width, img.height, currentAspect);
      setCrop(newCrop);
    }
  }, [context.parameters.aspect?.raw]); // Note: no dependency on imageLoaded

  const centerCropIfNeeded = () => {
    if (!aspect || aspect === 0) return;
    if (imgRef?.current && setCrop) {
      const img = imgRef.current;
      const newCrop = centerAspectCrop(img.width, img.height, aspect);
      setCrop(newCrop);
    }
  };

  return [aspect, centerCropIfNeeded];
}
