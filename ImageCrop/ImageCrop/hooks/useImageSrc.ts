import { useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes";

function stripQuotes(str: string): string {
  if (str && str.length > 1 && ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'")))) {
    return str.substring(1, str.length - 1);
  }
  return str;
}

/**
 * Custom hook to track the image source from PCF context and update when imageInput changes.
 * @param context The PCF context object
 * @returns The current image source (base64 or URL)
 */
export function useImageSrc(context: ComponentFramework.Context<IInputs>): string {
  const [imageSrc, setImageSrc] = useState<string>(stripQuotes(context.parameters.imageInput?.raw || ""));

  useEffect(() => {
    setImageSrc(stripQuotes(context.parameters.imageInput?.raw || ""));
  }, [context.parameters.imageInput?.raw]);

  return imageSrc;
}
