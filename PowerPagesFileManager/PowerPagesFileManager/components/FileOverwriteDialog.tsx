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

export interface IFileOverwriteDialogProps {
  fileName: string;
  duplicateCount?: number; // number of duplicates (inclusive)
  onOverwrite: () => void;
  onOverwriteAll: () => void;
  onCancel: () => void;
  language: LanguageCode; // New prop for translations
}

export function FileOverwriteDialog(props: IFileOverwriteDialogProps): React.ReactElement {
  const extraCount = props.duplicateCount && props.duplicateCount > 1 ? props.duplicateCount - 1 : 0;
  return (
    <Dialog 
      modalType="modal" 
      open={true}
      aria-modal="true"
      aria-labelledby="file-overwrite-title"
      aria-describedby="file-overwrite-content"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle id="file-overwrite-title">
            {getTranslation(Message.FileOverwriteDialogTitle, props.language)}
          </DialogTitle>
          <DialogContent id="file-overwrite-content">
            {getTranslation(Message.FileOverwriteDialogMessage, props.language, ({ fileName: props.fileName, extraCount }))}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onOverwrite} aria-label={getTranslation(Message.FileOverwriteDialogConfirm, props.language)}>
              {getTranslation(Message.FileOverwriteDialogConfirm, props.language)}
            </Button>
            <Button onClick={props.onOverwriteAll} disabled={!(props.duplicateCount && props.duplicateCount > 1)} aria-label={getTranslation(Message.FileOverwriteDialogConfirmAll, props.language)}>
              {getTranslation(Message.FileOverwriteDialogConfirmAll, props.language)}
            </Button>
            <Button onClick={props.onCancel} aria-label={getTranslation(Message.FileOverwriteDialogCancel, props.language)}>
              {getTranslation(Message.FileOverwriteDialogCancel, props.language)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
