import { useState, useCallback } from "react";

/**
 * Hook to track image loaded state, including reset when src is cleared.
 * @returns [imageLoaded, handleImageLoad, handleImageError, handleImageSrcChange]
 */
export function useImageLoaded() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Call this in <img onLoad={...} />
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Call this in <img onError={...} />
  const handleImageError = useCallback(() => {
    setImageLoaded(false);
  }, []);

  // Call this when the src changes
  const handleImageSrcChange = useCallback((src: string | null | undefined) => {
    setImageLoaded(false);
  }, []);

  return [imageLoaded, handleImageLoad, handleImageError, handleImageSrcChange] as const;
}
