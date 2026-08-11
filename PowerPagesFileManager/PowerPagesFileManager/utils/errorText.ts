/**
 * Appends the underlying error text to a user-facing message.
 *
 * Every call site used to discard the caught error, so a server response naming the exact
 * problem reached the user as a fixed string. Keep the composition here so it cannot drift.
 */

export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "";
}

export function withDetail(message: string, error: unknown): string {
  const detail = describeError(error).trim();
  return detail ? `${message} (${detail})` : message;
}
