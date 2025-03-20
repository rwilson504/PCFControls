import * as React from "react";
import { usePcfContext } from "../services/PcfContext";
import {
  Switch,
  Text,
  Button,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridCell,
  DataGridBody,
  DataGridHeaderCell
} from "@fluentui/react-components";
import { useStyles } from "../utils/styles";
import { IPcfContextServiceProps } from "../services/PcfContextService";
import { getEntities, hasUpdateAccess, getFirstPdfSetting, updatePdfSetting, updatePdfSettingsJson } from "../services/MetadataService";
import { PdfSetting } from "../types/PdfSetting";

export const ExportPDFManagerControl: React.FC<IPcfContextServiceProps> = (props) => {
  const pcfContext = usePcfContext();
  const styles = useStyles();
  // Check if control is visible
  if (!pcfContext.isVisible()) return <></>;

  const isDisabled = pcfContext.isControlDisabled();

  const [data, setData] = React.useState<{ displayName: string; logicalName: string }[]>([]);
  const [hasUpdateAccessState, setHasUpdateAccessState] = React.useState<boolean>(false);
  const [firstPdfSetting, setFirstPdfSetting] = React.useState<PdfSetting | null>(null);
  const [selectedEntities, setSelectedEntities] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      const entities = await getEntities(pcfContext.getBaseUrl()!);
      setData(entities);
    };
    void fetchData();

    const checkUpdateAccess = () => {
      const hasAccess = hasUpdateAccess(pcfContext.context);
      setHasUpdateAccessState(hasAccess);
    };
    void checkUpdateAccess();

    const fetchFirstPdfSetting = async () => {
      const pdfSetting = await getFirstPdfSetting(pcfContext.context);
      setFirstPdfSetting(pdfSetting);
      if (pdfSetting?.settings) {
        setSelectedEntities(JSON.parse(pdfSetting.settings) as Record<string, boolean>);
      }
    };
    void fetchFirstPdfSetting();
  }, []);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void (async () => {
      if (firstPdfSetting) {
        try {
          const updatedValue = await updatePdfSetting(pcfContext.context, firstPdfSetting.id, event.target.checked);
          setFirstPdfSetting({ ...firstPdfSetting, isEnabled: updatedValue });
        } catch (error) {
          console.error("Failed to update PDF setting:", error);
        }
      }
    })();
  };

  const handleSave = () => {
    void (async () => {
      if (firstPdfSetting) {
        try {
          const pdfSettingsJson = JSON.stringify(selectedEntities);
          await updatePdfSettingsJson(pcfContext.context, firstPdfSetting.id, pdfSettingsJson);
        } catch (error) {
          console.error("Failed to save PDF settings:", error);
        }
      }
    })();
  };

  // Define the columns for the DataGrid.
  const columns = [
    { key: "displayName", name: "Display Name" },
    { key: "logicalName", name: "Logical Name" }
  ];

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <Text>Enable PDF Settings</Text>
        <Switch
          checked={firstPdfSetting?.isEnabled ?? false}
          onChange={handleSwitchChange}
          disabled={!hasUpdateAccessState || isDisabled}
        />
      </div>
      {/* Replaced Table with a DataGrid */}
      <DataGrid
        items={data}
        columns={columns}
        sortable
        selectionMode="multiselect"
        getRowId={(item) => item.logicalName}
        focusMode="composite"
        style={{ minWidth: "550px", height: "500px", overflowY: "scroll" }}
        onSelectionChange={(event, selectedItems) => {
          // Update selectedEntities based on selection.
          const newSelectedEntities: Record<string, boolean> = {};
          selectedItems.forEach((item) => {
            newSelectedEntities[item.logicalName] = true;
          });
          setSelectedEntities(newSelectedEntities);
        }}
      >
        <DataGridHeader>
          <DataGridRow
            selectionCell={{ checkboxIndicator: { "aria-label": "Select all rows" } }}
          >
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody>
          {({ item, rowId }) => (
            <DataGridRow
              key={rowId}
              selectionCell={{ checkboxIndicator: { "aria-label": "Select row" } }}
            >
              {() => (
                <>
                  <DataGridCell>{item.displayName}</DataGridCell>
                  <DataGridCell>{item.logicalName}</DataGridCell>
                </>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Button
        onClick={handleSave}
        disabled={!hasUpdateAccessState || isDisabled}
        style={{ marginTop: "10px" }}
      >
        Save
      </Button>
    </>
  );
};
