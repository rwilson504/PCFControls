import { Crop } from "react-image-crop";
import { IInputs } from "../generated/ManifestTypes";
import { useRef, useEffect } from "react";

export function useDefaultCrop(
  context: ComponentFramework.Context<IInputs>,
  setCrop: (crop: Crop) => void,
  crop: Crop | undefined
) {
  const didSet = useRef(false);

  useEffect(() => {
    if (didSet.current) return;
    const unit = context.parameters.DefaultUnit.raw || "%";
    const x = context.parameters.DefaultX.raw ?? -1;
    const y = context.parameters.DefaultY.raw ?? -1;
    const width = context.parameters.DefaultWidth.raw ?? -1;
    const height = context.parameters.DefaultHeight.raw ?? -1;
    if (x !== -1 && y !== -1 && width !== -1 && height !== -1 && !crop) {
      setCrop({ unit, x, y, width, height });
      didSet.current = true;
    }
  }, [context, setCrop, crop]);
}
