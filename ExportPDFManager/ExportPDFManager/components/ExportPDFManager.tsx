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
  TableRowId
} from "@fluentui/react-components";
import { useStyles } from "../utils/styles";
import { IPcfContextServiceProps } from "../services/PcfContextService";
import { getEntities, hasUpdateAccess, getFirstPdfSetting, updatePdfSetting, updatePdfSettingsJson } from "../services/MetadataService";
import { PdfSetting } from "../types/PdfSetting";
import { PdfEntity } from "../types/PdfEntity";

export const ExportPDFManagerControl: React.FC<IPcfContextServiceProps> = (props) => {
  const pcfContext = usePcfContext();
  const styles = useStyles();
  if (!pcfContext.isVisible()) return <></>;

  const isDisabled = pcfContext.isControlDisabled();

  const [data, setData] = React.useState<PdfEntity[]>([]);
  const [hasUpdateAccessState, setHasUpdateAccessState] = React.useState<boolean>(false);
  const [firstPdfSetting, setFirstPdfSetting] = React.useState<PdfSetting | null>(null);
  const [selectedEntities, setSelectedEntities] = React.useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = React.useState(
    new Set<TableRowId>()
  );

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

  const onSelectionChange: DataGridProps["onSelectionChange"] = (e, data) => {
    setSelectedRows(data.selectedItems);
  };

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
      <div style={{ marginBottom: "10px" }}>
        <Text>Enable PDF Settings</Text>
        <Switch
          checked={firstPdfSetting?.isEnabled ?? false}
          onChange={handleSwitchChange}
          disabled={!hasUpdateAccessState || isDisabled}
        />
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
            selectionCell={{ checkboxIndicator: { "aria-label": "Select all rows" } }}
          >
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<PdfEntity>>
          {({ item, rowId }) => (
            <DataGridRow<PdfEntity> key={rowId} selectionCell={{ checkboxIndicator: { "aria-label": "Select row" } }}>
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
