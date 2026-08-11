import * as React from "react";
import {
  getFileOperationState,
  subscribeToFileOperations,
  IFileOperationState,
} from "../services/PageNotifier";

/**
 * Subscribes to the notifier that already counts every upload and delete.
 *
 * Deletes are tracked inside AnnotationService rather than at the call sites, so reading busy
 * state from here means a delete path added later is covered without touching this component.
 */
export function useFileOperationState(): IFileOperationState {
  const [state, setState] = React.useState<IFileOperationState>(getFileOperationState);

  React.useEffect(() => {
    setState(getFileOperationState());
    return subscribeToFileOperations(setState);
  }, []);

  return state;
}
