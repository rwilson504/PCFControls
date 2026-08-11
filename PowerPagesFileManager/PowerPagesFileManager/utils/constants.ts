export const AZURE_FILE_EXTENSION = ".azure.txt";

// Host page notification contract. Changing any of these breaks any Power Pages site
// already listening, so treat them as public API.
export const GLOBAL_NAMESPACE = "RAWFileManagerInfo" as const;
export const BUSY_ATTRIBUTE = "data-raw-file-busy";
export const EVENT_CHANGE = "raw-filemanager:change";
export const EVENT_BUSY = "raw-filemanager:busy";
export const EVENT_IDLE = "raw-filemanager:idle";

// Trailing delay before announcing idle, so back-to-back operations do not flash the
// host page overlay off and on between them.
export const IDLE_SETTLE_MS = 250;

// Optional query string overrides for the theme input properties, so a Power Pages page can
// pick a theme without editing the form. Public API, same as the notification contract above.
export const URL_PARAM_THEME_COLOR = "themeColor";
export const URL_PARAM_THEME_DARK_MODE = "themeDarkMode";

export const DEFAULT_THEME_COLOR = "#0F6CBD";
