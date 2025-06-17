import { useState, useEffect } from "react";

/**
 * Custom hook to calculate the browser scaling factor for an image element.
 * Returns the ratio of clientWidth to naturalWidth (or 1 if not available).
 * @param imgRef React ref to the image element (may be null initially)
 * @returns browser scaling factor (number)
 */
export function useBrowserScaling(imgRef: React.RefObject<HTMLImageElement | null>): number {
  const [scaling, setScaling] = useState(1);

  useEffect(() => {
    function updateScaling() {
      const img = imgRef.current;
      if (img && img.naturalWidth > 0) {
        setScaling(img.clientWidth / img.naturalWidth);
      } else {
        setScaling(1);
      }
    }
    updateScaling();
    window.addEventListener("resize", updateScaling);
    // If the image loads after mount, recalculate scaling
    let img = imgRef.current;
    let observer: MutationObserver | undefined;
    if (!img) {
      // Watch for the image ref to become available
      observer = new MutationObserver(() => {
        img = imgRef.current;
        if (img) {
          updateScaling();
          img.addEventListener("load", updateScaling);
          observer?.disconnect();
        }
      });
      if (imgRef && imgRef.current?.parentElement) {
        observer.observe(imgRef.current.parentElement, { childList: true, subtree: true });
      }
    } else {
      img.addEventListener("load", updateScaling);
    }
    return () => {
      window.removeEventListener("resize", updateScaling);
      if (img) {
        img.removeEventListener("load", updateScaling);
      }
      observer?.disconnect();
    };
  }, [imgRef]);

  return scaling;
}
