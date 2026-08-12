/**
 * Composes the text shown to a user when an operation fails.
 *
 * Call sites used to discard the caught error entirely, so a server response naming the exact
 * problem reached the user as a fixed string. They now pass the error here instead. What gets
 * appended is a *translated description* of the failure, never the server's own wording: that
 * text is English only and names infrastructure the user cannot see. The raw code and message
 * are logged by HttpClient so support still has them.
 */

import { getTranslation, LanguageCode, Message } from "./localization";
import { FileApiError, messageForCode } from "./fileApiErrors";

export function withDetail(message: string, error: unknown, language: LanguageCode): string {
  const key = error instanceof FileApiError ? messageForCode(error.code) : Message.FileErrorUnexpected;
  return `${message} ${getTranslation(key, language)}`;
}
