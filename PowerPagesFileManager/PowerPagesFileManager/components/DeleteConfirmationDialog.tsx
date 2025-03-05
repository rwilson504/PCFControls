import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@fluentui/react-components";
import { getTranslation, LanguageCode, Message } from "../utils/localization";

export interface IDeleteConfirmationDialogProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  language: LanguageCode;
}

export function DeleteConfirmationDialog(props: IDeleteConfirmationDialogProps): React.ReactElement {
  return (
    <Dialog 
      open={true}
      modalType="modal"
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-content"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle id="delete-confirmation-title">
            {getTranslation(Message.DeleteConfirmation, props.language)}
          </DialogTitle>
          <DialogContent id="delete-confirmation-content">
            {props.count === 1 
              ? getTranslation(Message.DeleteConfirmationSingle, props.language) 
              : getTranslation(Message.DeleteConfirmationMultiple, props.language, { count: props.count })}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onConfirm} aria-label={getTranslation(Message.ConfirmDelete, props.language)}>
              {getTranslation(Message.ConfirmDelete, props.language)}
            </Button>
            <Button onClick={props.onCancel} aria-label={getTranslation(Message.Cancel, props.language)}>
              {getTranslation(Message.Cancel, props.language)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
