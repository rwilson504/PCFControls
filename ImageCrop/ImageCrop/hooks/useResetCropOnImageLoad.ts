import { useEffect } from "react";
import { Crop, PixelCrop } from "react-image-crop";

/**
 * Custom hook to set crop and completedCrop when image is loaded and defaultCrop is available.
 * @param imageLoaded - boolean indicating if the image is loaded
 * @param defaultCrop - the default crop object
 * @param imgRef - ref to the image element
 * @param setCrop - setter for crop state
 * @param setCompletedCrop - setter for completedCrop state
 * @param convertToPixelCrop - utility to convert crop to PixelCrop
 */
export function useResetCropOnImageLoad(
  imageLoaded: boolean,
  defaultCrop: Crop | undefined,
  imgRef: React.RefObject<HTMLImageElement>,
  setCrop: (crop: Crop) => void,
  setCompletedCrop: (crop: PixelCrop) => void,
  convertToPixelCrop: (crop: Crop, width: number, height: number) => PixelCrop
) {
  useEffect(() => {
    if (
      imageLoaded &&
      defaultCrop &&
      imgRef.current &&
      imgRef.current.width > 0 &&
      imgRef.current.height > 0
    ) {
      setCrop(defaultCrop);
      setCompletedCrop(
        convertToPixelCrop(defaultCrop, imgRef.current.width, imgRef.current.height)
      );
    }
  }, [imageLoaded, defaultCrop, imgRef, setCrop, setCompletedCrop, convertToPixelCrop]);
}
