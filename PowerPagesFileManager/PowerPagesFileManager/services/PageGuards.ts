import { getFileOperationState } from "./PageNotifier";

let installed = false;

const dragCarriesFiles = (event: DragEvent): boolean =>
  !!event.dataTransfer && Array.from(event.dataTransfer.types).includes("Files");

// Without a window level preventDefault on BOTH dragover and drop, a file dropped outside
// the drop zone makes the browser navigate away to open it, losing the form the user is on.
const onWindowDragOver = (event: DragEvent): void => {
  if (dragCarriesFiles(event)) {
    event.preventDefault();
  }
};

const onWindowDrop = (event: DragEvent): void => {
  if (dragCarriesFiles(event)) {
    event.preventDefault();
  }
};

const onBeforeUnload = (event: BeforeUnloadEvent): void => {
  if (!getFileOperationState().busy) {
    return;
  }
  event.preventDefault();
  // Browsers show their own wording and ignore this string, but some still require it to be set.
  event.returnValue = "";
};

/**
 * Installs page level protections for in flight transfers. Registered once per page and never
 * removed, because a second control instance would otherwise lose the guards when the first
 * one is destroyed. Both handlers are inert unless a file drag or a live operation is present.
 */
export function installPageGuards(): void {
  if (installed) {
    return;
  }
  installed = true;

  // Listeners are passive:false by necessity, since both call preventDefault.
  window.addEventListener("dragover", onWindowDragOver, false);
  window.addEventListener("drop", onWindowDrop, false);
  window.addEventListener("beforeunload", onBeforeUnload);
}
