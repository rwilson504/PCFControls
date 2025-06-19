/**
 * Utility functions for crop calculations in the Image Cropper PCF control.
 * Provides helpers for centering and constraining aspect ratio crops.
 */
import { Crop, makeAspectCrop, centerCrop } from "react-image-crop";

/**
 * Calculates a centered crop rectangle with a given aspect ratio, sized to fit within the media dimensions.
 * The crop will be 90% of the media width, centered, and constrained to the aspect ratio.
 * @param mediaWidth The width of the image or video
 * @param mediaHeight The height of the image or video
 * @param aspect The desired aspect ratio (width / height)
 * @returns A Crop object representing the centered aspect crop
 */
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}
