import { BUSY_ATTRIBUTE, EVENT_BUSY, EVENT_CHANGE, EVENT_IDLE, GLOBAL_NAMESPACE, IDLE_SETTLE_MS } from "../utils/constants";

export type FileOperationKind = "upload" | "delete";

export interface IFileOperationState {
  busy: boolean;
  uploads: number;
  deletes: number;
  total: number;
}

type Listener = (state: IFileOperationState) => void;

declare global {
  interface Window {
    RAWFileManagerInfo?: {
      __namespace: true;
      isBusy: () => boolean;
      getState: () => IFileOperationState;
      subscribe: (listener: Listener) => () => void;
      reset: () => void;
    };
  }
}

// Module scope, so several instances of this control on one page share one count.
const counts: Record<FileOperationKind, number> = { upload: 0, delete: 0 };
const listeners = new Set<Listener>();

let publishedBusy = false;
let settleTimer: ReturnType<typeof setTimeout> | undefined;

function buildState(): IFileOperationState {
  const total = counts.upload + counts.delete;
  return { busy: total > 0, uploads: counts.upload, deletes: counts.delete, total };
}

function emit(state: IFileOperationState): void {
  if (typeof document !== "undefined" && document.body) {
    if (state.busy) {
      document.body.setAttribute(BUSY_ATTRIBUTE, "true");
    } else {
      document.body.removeAttribute(BUSY_ATTRIBUTE);
    }
  }

  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // A subscriber that throws must not stop the remaining subscribers or strand the page.
    }
  });

  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_CHANGE, { detail: state }));
  window.dispatchEvent(new CustomEvent(state.busy ? EVENT_BUSY : EVENT_IDLE, { detail: state }));
}

function publish(): void {
  const state = buildState();

  if (state.busy) {
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = undefined;
    }
    if (!publishedBusy) {
      publishedBusy = true;
      emit(state);
    }
    return;
  }

  if (!publishedBusy || settleTimer) return;

  // Delay idle so a gap between two sequential operations does not flash the host overlay.
  settleTimer = setTimeout(() => {
    settleTimer = undefined;
    if (buildState().busy) return;
    publishedBusy = false;
    emit(buildState());
  }, IDLE_SETTLE_MS);
}

function begin(kind: FileOperationKind): void {
  counts[kind] += 1;
  publish();
}

function end(kind: FileOperationKind): void {
  counts[kind] = Math.max(0, counts[kind] - 1);
  publish();
}

/**
 * Wraps a file operation so the host page is told while it runs. The decrement is in a
 * finally block because a rejected promise must never leave the page locked.
 */
export async function trackOperation<T>(kind: FileOperationKind, operation: () => Promise<T>): Promise<T> {
  begin(kind);
  try {
    return await operation();
  } finally {
    end(kind);
  }
}

export function getFileOperationState(): IFileOperationState {
  return buildState();
}

export function subscribeToFileOperations(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Clears all counters. Called on unmount, and exposed on the global as the manual escape
 * hatch if a host page ever finds itself stuck.
 */
export function resetFileOperations(): void {
  counts.upload = 0;
  counts.delete = 0;
  if (settleTimer) {
    clearTimeout(settleTimer);
    settleTimer = undefined;
  }
  if (publishedBusy) {
    publishedBusy = false;
    emit(buildState());
  }
}

/**
 * Publishes the read side on window so host script that loads after an operation has
 * already started can still sync, instead of polling or missing the event.
 */
export function installPageNotifier(): void {
  if (typeof window === "undefined") return;
  if (window[GLOBAL_NAMESPACE]) return;

  window[GLOBAL_NAMESPACE] = {
    __namespace: true,
    isBusy: () => buildState().busy,
    getState: getFileOperationState,
    subscribe: subscribeToFileOperations,
    reset: resetFileOperations,
  };
}
