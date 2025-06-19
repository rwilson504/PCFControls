import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

/**
 * Calculates the scaling factor applied by Power Apps' responsive layout.
 * Compares allocated size (from context) to rendered size (via getBoundingClientRect).
 */
export function useResponsiveAppScaling(
  context: ComponentFramework.Context<IInputs>,
  elementRef: React.RefObject<HTMLElement | null>
): number {
  const [appScaling, setAppScaling] = useState(1);

  useEffect(() => {
    if (!elementRef.current) return;

    const allocatedWidth = context.mode.allocatedWidth;
    const allocatedHeight = context.mode.allocatedHeight;

    const updateAppScaling = () => {
      const rect = elementRef.current?.getBoundingClientRect();
      if (!rect || allocatedWidth === 0 || allocatedHeight === 0) return;

      const scaleX = rect.width / allocatedWidth;
      const scaleY = rect.height / allocatedHeight;

      // Use the smaller value for conservative scaling
      setAppScaling(Math.min(scaleX, scaleY));
    };

    updateAppScaling();

    const observer = new ResizeObserver(updateAppScaling);
    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [context, elementRef]);

  return appScaling;
}
