import { Crop } from "react-image-crop";

export function makeAspectCrop(
  crop: Partial<Crop>,
  aspect: number,
  mediaWidth: number,
  mediaHeight: number
): Crop {
  if (!aspect || !mediaWidth || !mediaHeight) return crop as Crop;
  let width = crop.width ?? 100;
  const unit = crop.unit ?? "%";
  let height = width / aspect;
  if (unit === "%") {
    width = (mediaWidth * width) / 100;
    height = width / aspect;
    width = (width / mediaWidth) * 100;
    height = (height / mediaHeight) * 100;
  }
  return {
    ...crop,
    width,
    height,
    unit,
    x: crop.x ?? 0,
    y: crop.y ?? 0,
  };
}

export function centerCrop(
  crop: Crop,
  mediaWidth: number,
  mediaHeight: number
): Crop {
  let x = (mediaWidth - (crop.width / 100) * mediaWidth) / 2;
  let y = (mediaHeight - (crop.height / 100) * mediaHeight) / 2;
  if (crop.unit === "%") {
    x = ((mediaWidth - (crop.width / 100) * mediaWidth) / mediaWidth) * 100;
    y = ((mediaHeight - (crop.height / 100) * mediaHeight) / mediaHeight) * 100;
  }
  return {
    ...crop,
    x,
    y,
  };
}

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
