// Utility functions for string manipulation in PCF controls

/**
 * Removes surrounding single or double quotes from a string, if present.
 * @param str The input string (may be undefined)
 * @returns The unquoted string, or undefined if input is undefined
 */
export function stripQuotes(str: string | undefined): string | undefined {
  if (
    str &&
    str.length > 1 &&
    ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'")))
  ) {
    return str.substring(1, str.length - 1);
  }
  return str;
}
