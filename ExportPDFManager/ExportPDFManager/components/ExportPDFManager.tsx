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
  DataGridHeaderCell,
  TableColumnDefinition,
  createTableColumn,
  TableCellLayout,
  DataGridProps,
  TableRowId,
} from "@fluentui/react-components";
import { useStyles } from "../utils/styles";
import { IPcfContextServiceProps } from "../services/PcfContextService";
import {
  getEntities,
  hasUpdateAccess,
  getFirstPdfSetting,
  updatePdfSetting,
  updatePdfSettingsJson,
} from "../services/MetadataService";
import { PdfSetting } from "../types/PdfSetting";
import { PdfEntity } from "../types/PdfEntity";

export const ExportPDFManagerControl: React.FC<IPcfContextServiceProps> = (
  props
) => {
  const pcfContext = usePcfContext();
  const styles = useStyles();
  if (!pcfContext.isVisible()) return <></>;

  const isDisabled = pcfContext.isControlDisabled();
  const [data, setData] = React.useState<PdfEntity[]>([]);
  const [hasUpdateAccessState, setHasUpdateAccessState] =
    React.useState<boolean>(false);
  const [firstPdfSetting, setFirstPdfSetting] =
    React.useState<PdfSetting | null>(null);
  const [selectedRows, setSelectedRows] = React.useState(new Set<TableRowId>());
  const [hasChanges, setHasChanges] = React.useState<boolean>(false); // added state

  React.useEffect(() => {
    const fetchData = async () => {
      const entities = await getEntities(pcfContext.getBaseUrl()!);
      setData(entities);
    };
    void fetchData();

    const checkUpdateAccess = async () => {
      const hasAccess = await hasUpdateAccess(pcfContext.context);
      setHasUpdateAccessState(hasAccess);
    };
    void checkUpdateAccess();

    const fetchFirstPdfSetting = async () => {
      const pdfSetting = await getFirstPdfSetting(pcfContext.context);
      setFirstPdfSetting(pdfSetting);
      if (pdfSetting?.settings) {
        const parsedSettings = JSON.parse(pdfSetting.settings) as Record<string, boolean>;
        const savedRows = Object.entries(parsedSettings)
          .filter(([key, value]) => value === true)
          .map(([key]) => key);
        setSelectedRows(new Set(savedRows));
      }
    };
    void fetchFirstPdfSetting();
  }, []);

  const onSelectionChange: DataGridProps["onSelectionChange"] = (e, data) => {
    setSelectedRows(data.selectedItems);
    setHasChanges(true); // mark changes occurred
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update local switch value without calling updatePdfSetting
    if (firstPdfSetting) {
      setFirstPdfSetting({ ...firstPdfSetting, isEnabled: event.target.checked });
      setHasChanges(true); // mark changes occurred
    }
  };

  const handleSave = () => {
    void (async () => {
      if (firstPdfSetting) {
        try {
          // Update the switch value via updatePdfSetting on save
          const updatedValue = await updatePdfSetting(
            pcfContext.context,
            firstPdfSetting.id,
            firstPdfSetting.isEnabled
          );
          setFirstPdfSetting({ ...firstPdfSetting, isEnabled: updatedValue });
          // Build settings JSON object with selected rows mapped to true
          const pdfSettings: Record<string, boolean> = {};
          selectedRows.forEach((row) => {
            pdfSettings[row] = true;
          });
          const pdfSettingsJson = JSON.stringify(pdfSettings);
          await updatePdfSettingsJson(
            pcfContext.context,
            firstPdfSetting.id,
            pdfSettingsJson
          );
          setHasChanges(false); // reset changes after save
        } catch (error) {
          console.error("Failed to save PDF settings:", error);
        }
      }
    })();
  };

  const isSaveDisabled = !hasChanges || !hasUpdateAccessState || isDisabled; // computed disabled

  const columns: TableColumnDefinition<PdfEntity>[] = [
    createTableColumn<PdfEntity>({
      columnId: "displayName",
      compare: (a, b) => a.displayName.localeCompare(b.displayName),
      renderHeaderCell: () => "Display Name",
      renderCell: (item) => (
        <TableCellLayout>{item.displayName}</TableCellLayout>
      ),
    }),
    createTableColumn<PdfEntity>({
      columnId: "logicalName",
      compare: (a, b) => a.logicalName.localeCompare(b.logicalName),
      renderHeaderCell: () => "Logical Name",
      renderCell: (item) => (
        <TableCellLayout>{item.logicalName}</TableCellLayout>
      ),
    }),
  ];

  return (
    <>
      {/* Top control container with switch on left and save button on right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <Text>Enable PDF Settings</Text>
          <Switch
            checked={firstPdfSetting?.isEnabled ?? false}
            onChange={handleSwitchChange}
            {...(!hasUpdateAccessState || isDisabled ? { disabled: true } : {})}
          />
        </div>
        <div>
          <Button onClick={handleSave} disabled={isSaveDisabled}>
            Save
          </Button>
        </div>
      </div>
      <DataGrid
        items={data}
        columns={columns}        
        sortable
        selectionMode="multiselect"
        getRowId={(item) => item.logicalName}
        focusMode="composite"
        style={{ minWidth: "550px", height: "500px", overflowY: "scroll" }}
        selectedItems={selectedRows}
        onSelectionChange={onSelectionChange}
      >
        <DataGridHeader>
          <DataGridRow
            selectionCell={{
              // added disabled property to select all checkbox
              checkboxIndicator: { "aria-label": "Select all rows", ...(!hasUpdateAccessState || isDisabled ? { disabled: true } : {}) },
            }}
          >
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<PdfEntity>>
          {({ item, rowId }) => (
            <DataGridRow<PdfEntity>
              key={rowId}
              selectionCell={{
                // added disabled property to each row checkbox
                checkboxIndicator: { "aria-label": "Select row", ...(!hasUpdateAccessState || isDisabled ? { disabled: true } : {}) },
              }}
            >
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      {/* Bottom Save Button wrapped in flex container */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>
    </>
  );
};
