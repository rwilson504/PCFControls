/* eslint-disable */

import axios, { AxiosResponse } from "axios";
import { PdfSetting } from "../types/PdfSetting";
import { IInputs } from "../generated/ManifestTypes";

export const getEntities = async (
  baseUrl: string,
): Promise<{ displayName: string; logicalName: string }[]> => {
  const filter =
    "IsValidForAdvancedFind%20eq%20true%20and%20IsCustomizable/Value%20eq%20true";
  const url = `${baseUrl}/api/data/v9.1/EntityDefinitions?$select=LogicalName,DisplayName&$filter=${filter}`;

  try {
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    const result = response.data;
    if (result.status < 0) {
      throw new Error(result.statusText);
    }

    return result.value.map(
      (entity: {
        DisplayName: { UserLocalizedLabel: { Label: string } };
        LogicalName: string;
      }) => ({
        displayName:
          entity.DisplayName?.UserLocalizedLabel?.Label || entity.LogicalName,
        logicalName: entity.LogicalName,
      })
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.statusText ?? error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export const hasUpdateAccess = (
  context: ComponentFramework.Context<IInputs>
): boolean => {
  return context.utils.hasEntityPrivilege("pdfsetting", 3, 3) as boolean; // Write = 3, Global = 3
};

export const getFirstPdfSetting = async (
  context: ComponentFramework.Context<IInputs>
): Promise<PdfSetting | null> => {
  const result = await context.webAPI.retrieveMultipleRecords(
    "pdfsetting",
    "?$top=1"
  );
  if (result.entities && result.entities.length > 0) {
    const entity = result.entities[0];
    return {
      id: entity.pdfsettingid as string,
      isEnabled: entity.ispdfsettingenabled as boolean,
      settings: entity.pdfsettingsjson as string,
    };
  } else {
    return null;
  }
};

export const updatePdfSetting = async (
  context: ComponentFramework.Context<IInputs>,
  id: string,
  isPdfSettingEnabled: boolean
): Promise<boolean> => {
  await context.webAPI.updateRecord("pdfsetting", id, {
    ispdfsettingenabled: isPdfSettingEnabled,
  });
  const updatedRecord = await context.webAPI.retrieveRecord(
    "pdfsetting",
    id,
    "?$select=ispdfsettingenabled"
  );
  return updatedRecord.ispdfsettingenabled as boolean;
};

export const updatePdfSettingsJson = async (
  context: ComponentFramework.Context<IInputs>,
  id: string,
  pdfSettingsJson: string
): Promise<string> => {
  await context.webAPI.updateRecord("pdfsetting", id, {
    pdfsettingsjson: pdfSettingsJson,
  });
  const updatedRecord = await context.webAPI.retrieveRecord(
    "pdfsetting",
    id,
    "?$select=pdfsettingsjson"
  );
  return updatedRecord.pdfsettingsjson as string;
};

export const getBaseUrl = (): string | undefined => {
  // @ts-expect-error context is available in model apps
  // eslint-disable-next-line
  return (context as any).page.getClientUrl() as string;
};
