import { Message } from "./localization";

/**
 * Maps the Power Pages file API error codes to messages a user can act on.
 *
 * The codes and their server text are published at
 * https://learn.microsoft.com/en-us/power-pages/configure/webapi-azure-blob#error-codes-and-messages
 *
 * Twenty two codes collapse to eight messages on purpose. Several codes describe the same
 * situation from the server's point of view but are indistinguishable from the user's, and
 * several describe infrastructure the user cannot see and must not be told about.
 */

/** Error carrying the file API code, so the code survives being thrown and re-caught. */
export class FileApiError extends Error {
  readonly code?: string;
  readonly serverMessage?: string;

  constructor(message: string, code?: string, serverMessage?: string) {
    super(message);
    this.name = "FileApiError";
    this.code = code;
    this.serverMessage = serverMessage;
    // Required so `instanceof` works after TypeScript downlevels to ES5.
    Object.setPrototypeOf(this, FileApiError.prototype);
  }
}

const CODE_TO_MESSAGE: Record<string, Message> = {
  FU00001: Message.FileErrorEmptyFile,
  FU00002: Message.FileErrorRecordNotFound,
  FU00003: Message.FileErrorNoPermission,
  FU00004: Message.FileErrorTypeNotAllowed,
  FU00005: Message.FileErrorTypeNotAllowed,
  FU00006: Message.FileErrorTooLarge,
  FU00007: Message.FileErrorNotConfigured,
  // FU00008, FU00013, FU00014 mean this control sent a malformed request. The user cannot
  // act on any of them, so they fall through to the generic message and get logged instead.
  FU00009: Message.FileErrorNotConfigured,
  FU00010: Message.FileErrorFileUnavailable,
  FU00011: Message.FileErrorNotConfigured,
  FU00012: Message.FileErrorFileUnavailable,
  FU00015: Message.FileErrorTypeNotAllowed,
  FU00016: Message.FileErrorTypeNotAllowed,
  FU00017: Message.FileErrorTooLarge,
  // FU00018 is the site's Entra app lacking a role assignment, not the signed in user
  // lacking access. Saying "you do not have permission" would send the user to the wrong place.
  FU00018: Message.FileErrorNotConfigured,
  FU00019: Message.FileErrorNotConfigured,
  FU00021: Message.FileErrorTypeNotAllowed,
  FU00022: Message.FileErrorNotConfigured
};

/** Returns the message key for a code, or the generic one for an unknown or absent code. */
export function messageForCode(code: string | undefined): Message {
  if (!code) {
    return Message.FileErrorUnexpected;
  }
  return CODE_TO_MESSAGE[code.toUpperCase()] || Message.FileErrorUnexpected;
}
