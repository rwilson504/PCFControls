import * as React from "react";
import { Button } from "@fluentui/react-components";
import { getTranslation, LanguageCode, Message } from "../utils/localization";

export interface IHeaderButtonsProps {
  selectedCount: number;
  uploadingCount: number;
  onDelete: () => void;
  onCancel: () => void;
  onToggleCollapse: () => void;
  language: LanguageCode; // Added language prop
}

export const HeaderButtons = (props: IHeaderButtonsProps): JSX.Element => {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Button
        appearance="primary"
        disabled={props.selectedCount === 0}
        onClick={props.onDelete}
        aria-label={getTranslation(Message.DeleteSelected, props.language)}
      >
        {getTranslation(Message.DeleteSelected, props.language)}
      </Button>
      <Button
        appearance="primary"
        disabled={props.uploadingCount === 0}
        onClick={props.onCancel}
        aria-label={getTranslation(Message.CancelUpload, props.language)}
      >
        {getTranslation(Message.CancelUpload, props.language)}
      </Button>
      <Button
        appearance="primary"
        onClick={props.onToggleCollapse}
        aria-label={getTranslation(Message.HideFiles, props.language)}
      >
        {getTranslation(Message.HideFiles, props.language)}
      </Button>
    </div>
  );
};

export default HeaderButtons;
