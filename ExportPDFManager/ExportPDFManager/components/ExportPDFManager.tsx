import * as React from "react";
import { usePcfContext } from "../services/PcfContext";
import {
  Switch,
  Text,
  Button,
  Spinner,
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
import { CheckmarkFilled } from "@fluentui/react-icons"; // new import
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

type SaveState = "initial" | "loading" | "loaded";

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
  const [saveState, setSaveState] = React.useState<SaveState>("initial"); // replaced isSaving state
  const [sortState, setSortState] = React.useState<
    Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]
  >({
    sortColumn: "displayName",
    sortDirection: "ascending",
  });
  
  React.useEffect(() => {
    const fetchData = async () => {
      const entities = await getEntities(pcfContext.getBaseUrl()!);
      setData(entities);
    };
    void fetchData();

    const fetchFirstPdfSetting = async () => {
      const pdfSetting = await getFirstPdfSetting(pcfContext.context);
      setFirstPdfSetting(pdfSetting);
      if (pdfSetting?.settings) {
        const parsedSettings = JSON.parse(pdfSetting.settings) as Record<
          string,
          boolean
        >;
        const savedRows = Object.entries(parsedSettings)
          .filter(([key, value]) => value === true)
          .map(([key]) => key);
        setSelectedRows(new Set(savedRows));
      }
    };
    void fetchFirstPdfSetting();

    const checkUpdateAccess = async () => {
      const hasAccess = await hasUpdateAccess(pcfContext.context);
      setHasUpdateAccessState(hasAccess);
    };
    void checkUpdateAccess();
  }, []);

  const onSelectionChange: DataGridProps["onSelectionChange"] = (e, data) => {
    setSelectedRows(data.selectedItems);
    setHasChanges(true); // mark changes occurred
  };

  const onSortChange: DataGridProps["onSortChange"] = (e, nextSortState) => {
    setSortState(nextSortState);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update local switch value without calling updatePdfSetting
    if (firstPdfSetting) {
      setFirstPdfSetting({
        ...firstPdfSetting,
        isEnabled: event.target.checked,
      });
      setHasChanges(true); // mark changes occurred
    }
  };

  const handleSave = () => {
    void (async () => {
      if (firstPdfSetting) {
        try {
          setSaveState("loading");
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
          setSaveState("loaded");
          // Replace useTimeout with standard setTimeout:
          setTimeout(() => setSaveState("initial"), 2000);
        } catch (error) {
          console.error("Failed to save PDF settings:", error);
          setSaveState("initial");
        }
      }
    })();
  };

  const isSaveDisabled =
    !hasChanges ||
    !hasUpdateAccessState ||
    isDisabled ||
    saveState === "loading"; // include loading state

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
    <div
      style={{ height: props.height, display: "flex", flexDirection: "column" }}
    >
      {/* Top control container with switch on left and save button on right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <Text>Enable PDF Settings</Text>
          <Switch
            checked={firstPdfSetting?.isEnabled ?? false}
            onChange={handleSwitchChange}
            {...(!hasUpdateAccessState || isDisabled ? { disabled: true } : {})}
          />
        </div>
        <div>
          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            icon={
              saveState === "loading" ? (
                <Spinner size="tiny" />
              ) : saveState === "loaded" ? (
                <CheckmarkFilled />
              ) : undefined
            }
          >
            Save
          </Button>
        </div>
      </div>
      {/* DataGrid container fills remaining space */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        <DataGrid
          items={data}
          columns={columns}
          sortable
          sortState={sortState}
          onSortChange={onSortChange}
          selectionMode="multiselect"
          getRowId={(item) => item.logicalName}
          focusMode="composite"
          style={{ minWidth: "550px" }}
          selectedItems={selectedRows}
          onSelectionChange={onSelectionChange}
        >
          <DataGridHeader>
            <DataGridRow
              style={{
                pointerEvents:
                  !hasUpdateAccessState || isDisabled || saveState === "loading"
                    ? "none"
                    : undefined,
              }}
              selectionCell={{
                // added saveState condition to disable the select all checkbox while saving
                checkboxIndicator: {
                  "aria-label": "Select all rows",
                  ...(!hasUpdateAccessState ||
                  isDisabled ||
                  saveState === "loading"
                    ? { disabled: true }
                    : {}),
                },
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
                style={{
                  pointerEvents:
                    !hasUpdateAccessState ||
                    isDisabled ||
                    saveState === "loading"
                      ? "none"
                      : undefined,
                }}
                selectionCell={{
                  // added saveState condition to disable each row checkbox while saving
                  checkboxIndicator: {
                    "aria-label": "Select row",
                    ...(!hasUpdateAccessState ||
                    isDisabled ||
                    saveState === "loading"
                      ? { disabled: true }
                      : {}),
                  },
                }}
              >
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
      {/* Bottom Save Button wrapped in flex container */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
          icon={
            saveState === "loading" ? (
              <Spinner size="tiny" />
            ) : saveState === "loaded" ? (
              <CheckmarkFilled />
            ) : undefined
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
};
