import { createDarkTheme, createLightTheme } from "@fluentui/react-components";
import type { BrandVariants, Theme } from "@fluentui/react-components";
import chroma from "chroma-js";

/**
 * Ensures the color string includes the '#' prefix.
 * @param color The color string provided by the user.
 * @returns A valid color string with the '#' prefix.
 */
const ensureHexColor = (color: string): string => {
    return color.startsWith('#') ? color : `#${color}`;
  };

/**
 * Generates a BrandVariants object based on a single color.
 * @param baseColor The base color provided by the user.
 * @returns A BrandVariants object.
 */
const generateBrandVariants = (baseColor: string): BrandVariants => {
    const validBaseColor = ensureHexColor(baseColor);
    const scale = chroma.scale([chroma(validBaseColor).darken(3), validBaseColor, chroma(validBaseColor).brighten(3)]).mode('lab').colors(16);
    return {
    10: scale[0],
    20: scale[1],
    30: scale[2],
    40: scale[3],
    50: scale[4],
    60: scale[5],
    70: scale[6],
    80: scale[7],
    90: scale[8],
    100: scale[9],
    110: scale[10],
    120: scale[11],
    130: scale[12],
    140: scale[13],
    150: scale[14],
    160: scale[15],
  };
};

/**
 * Generates a light theme based on the provided base color.
 * @param baseColor The base color provided by the user.
 * @returns A light theme.
 */
export const generateLightTheme = (baseColor: string): Theme => {
  const brandVariants = generateBrandVariants(baseColor);
  return createLightTheme(brandVariants);
};

/**
 * Generates a dark theme based on the provided base color.
 * @param baseColor The base color provided by the user.
 * @returns A dark theme.
 */
export const generateDarkTheme = (baseColor: string): Theme => {
  const brandVariants = generateBrandVariants(baseColor);
  return createDarkTheme(brandVariants);
};
