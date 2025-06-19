import { useEffect, RefObject } from "react";
import { PixelCrop } from "react-image-crop";

export function useCropToBase64(
  imgRef: RefObject<HTMLImageElement | null>,
  completedCrop: PixelCrop | undefined,
  onCropComplete: (base64: string) => void,
  rotation = 0,
  scaling = 1,
  circularCrop = false
) {
  useEffect(() => {
    if (!completedCrop || !imgRef.current || completedCrop.width <= 0 || completedCrop.height <= 0) {      
      onCropComplete(getBlankImageBase64());
      return;
    }
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    // Circular crop: set a circular clipping path
    if (circularCrop) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / (2 * pixelRatio),
        canvas.height / (2 * pixelRatio),
        canvas.width / (2 * pixelRatio),
        canvas.height / (2 * pixelRatio),
        0,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.clip();
    }

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const rotateRads = (rotation * Math.PI) / 180;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    ctx.translate(-cropX, -cropY); // 5) Move crop origin to canvas origin
    ctx.translate(centerX, centerY); // 4) Move origin to image center
    ctx.rotate(rotateRads); // 3) Rotate
    ctx.scale(scaling, scaling); // 2) Scale
    ctx.translate(-centerX, -centerY); // 1) Move image center to origin

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
    ctx.restore();

    if (circularCrop) {
      ctx.restore(); // Restore after clipping
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            onCropComplete(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      },
      "image/png"
    );
  }, [completedCrop, imgRef, rotation, scaling, circularCrop]);
}

function getBlankImageBase64(width = 1, height = 1): string {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, width, height); // transparent
    }
    return canvas.toDataURL("image/png");
}