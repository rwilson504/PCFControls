/**
 * Parsing for the `allowedFileTypes` and `allowedMimeTypes` properties.
 *
 * Validation and the file picker's `accept` attribute both read from here on purpose. When
 * they derived their own lists, they disagreed: a configured `.png` produced a correct picker
 * filter and then failed validation, because the validator compared extensions without a dot.
 */

/** Extensions are stored without a leading dot, so a configured `.png` and `png` are the same. */
export const parseFileExtensions = (raw: string | null | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase().replace(/^\.+/, ""))
    .filter(Boolean);

export const parseMimeTypes = (raw: string | null | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

/** An empty list means the property was not configured, which allows everything. */
export const isExtensionAllowed = (extension: string, allowed: string[]): boolean =>
  allowed.length === 0 ||
  allowed.includes(extension.trim().toLowerCase().replace(/^\.+/, ""));

export const isMimeTypeAllowed = (mimeType: string, allowed: string[]): boolean => {
  if (allowed.length === 0) {
    return true;
  }
  const value = mimeType.trim().toLowerCase();
  return allowed.some((pattern) => {
    if (pattern === "*" || pattern === "*/*") {
      return true;
    }
    if (pattern.endsWith("/*")) {
      return value.startsWith(pattern.slice(0, -1));
    }
    return pattern === value;
  });
};

/**
 * Builds the picker filter. This is a convenience only: it is trivially bypassed and does not
 * apply to drag and drop, so validation stays the real control.
 */
export const buildAcceptAttribute = (
  rawFileTypes: string | null | undefined,
  rawMimeTypes: string | null | undefined
): string | undefined => {
  const extensions = parseFileExtensions(rawFileTypes).map((ext) => `.${ext}`);
  const mimeTypes = parseMimeTypes(rawMimeTypes);
  return [...extensions, ...mimeTypes].join(",") || undefined;
};
