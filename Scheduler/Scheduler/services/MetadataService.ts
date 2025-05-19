/* eslint-disable */

import axios, { AxiosResponse } from "axios";
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

export const getBaseUrl = (): string | undefined => {
  // @ts-expect-error context is available in model apps
  return (context as any).page.getClientUrl() as string;
};
