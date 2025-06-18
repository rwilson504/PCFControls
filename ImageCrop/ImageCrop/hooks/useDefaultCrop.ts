import { Crop } from "react-image-crop";
import { IInputs } from "../generated/ManifestTypes";
import { useState, useEffect } from "react";

export function useDefaultCrop(context: ComponentFramework.Context<IInputs>) {
  const [defaultCrop, setDefaultCrop] = useState<Crop | undefined>(() => getDefaultCrop(context));

  useEffect(() => {
    setDefaultCrop(getDefaultCrop(context));
  }, [
    context.parameters.DefaultUnit.raw,
    context.parameters.DefaultX.raw,
    context.parameters.DefaultY.raw,
    context.parameters.DefaultWidth.raw,
    context.parameters.DefaultHeight.raw
  ]);

  return defaultCrop;
}

export function getDefaultCrop(context: ComponentFramework.Context<IInputs>) {
  const unit = context.parameters.DefaultUnit.raw || "%";
  const x = context.parameters.DefaultX.raw ?? -1;
  const y = context.parameters.DefaultY.raw ?? -1;
  const width = context.parameters.DefaultWidth.raw ?? -1;
  const height = context.parameters.DefaultHeight.raw ?? -1;
  if (x !== -1 && y !== -1 && width !== -1 && height !== -1) {
    return { unit, x, y, width, height };
  }
  return undefined;
}
