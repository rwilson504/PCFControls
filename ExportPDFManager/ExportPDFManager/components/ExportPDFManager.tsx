import * as React from "react";
import { usePcfContext } from "../services/PcfContext";
import {
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHeaderCell,
  Switch,
  Text,
  Button,
} from "@fluentui/react-components";
import { useStyles } from "../utils/styles";
import { IPcfContextServiceProps } from "../services/PcfContextService";
import { getEntities, hasUpdateAccess, getFirstPdfSetting, updatePdfSetting, updatePdfSettingsJson } from "../services/MetadataService";
import { PdfSetting } from "../types/PdfSetting";

export const ExportPDFManagerControl: React.FC<IPcfContextServiceProps> = (
  props
) => {
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

  const handleCheckboxChange = (logicalName: string) => {
    setSelectedEntities((prevSelectedEntities) => {
      const newSelectedEntities = { ...prevSelectedEntities };
      if (newSelectedEntities[logicalName]) {
        delete newSelectedEntities[logicalName];
      } else {
        newSelectedEntities[logicalName] = true;
      }
      return newSelectedEntities;
    });
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
      
        <Table 
          role="table" 
          style={{ width: "100%", tableLayout: "fixed" }}
          noNativeElements={true}
        >
          <TableHeader>
            <TableRow>
              {/* Set first column width to 50px */}
              <TableCell style={{ width: "50px", minWidth: "50px" }}></TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Logical Name</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody style={{ height: '500px', overflowY: 'scroll' }}>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{ width: "50px", minWidth: "50px", position: "relative" }}>
                  <Checkbox
                    checked={selectedEntities[item.logicalName] || false}
                    onChange={() => handleCheckboxChange(item.logicalName)}
                  />
                </TableCell>
                <TableCell>{item.displayName}</TableCell>
                <TableCell>{item.logicalName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
