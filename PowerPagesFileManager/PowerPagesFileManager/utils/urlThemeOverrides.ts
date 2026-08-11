import {
  DEFAULT_THEME_COLOR,
  URL_PARAM_THEME_COLOR,
  URL_PARAM_THEME_DARK_MODE,
} from "./constants";

export interface ThemeSettings {
  color: string;
  darkMode: boolean;
}

// Only a bare hex literal is accepted. The value reaches chroma-js and ends up in generated
// CSS custom properties, so named colors and any functional syntax are rejected rather than
// sanitized, and a caller-supplied string can never widen into arbitrary CSS.
const HEX_COLOR = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeHexColor = (value: string | undefined | null): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!HEX_COLOR.test(trimmed)) {
    return undefined;
  }
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

const parseBoolean = (value: string | null): boolean | undefined => {
  if (value === null) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "0") {
    return false;
  }
  return undefined;
};

/**
 * Resolves the theme, preferring a query string override over the configured input property.
 * Any value that fails validation is discarded so the control falls back instead of throwing.
 */
export const resolveThemeSettings = (
  configuredColor: string | null | undefined,
  configuredDarkMode: boolean | null | undefined,
  search: string = window.location.search
): ThemeSettings => {
  const params = new URLSearchParams(search);
  return {
    color:
      normalizeHexColor(params.get(URL_PARAM_THEME_COLOR)) ??
      normalizeHexColor(configuredColor) ??
      DEFAULT_THEME_COLOR,
    darkMode:
      parseBoolean(params.get(URL_PARAM_THEME_DARK_MODE)) ??
      configuredDarkMode ??
      false,
  };
};
