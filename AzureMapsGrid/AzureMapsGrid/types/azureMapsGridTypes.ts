import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { PopupOptions, CameraBoundsOptions } from 'azure-maps-control';
import { IInputs } from "../generated/ManifestTypes";

export interface IAzureMapsGridControlProps {
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  height: number;
}

export interface EnvironmentSettingsState {
  settings: Record<string, unknown>;
  loading: boolean;
  errorTitle: string;
  errorMessage: string;
}

export interface MapKeys {
  lat: string;
  long: string;
  name: string;
  description: string;
  color: string;
}

export interface MarkerData {
  valid: DataSetInterfaces.EntityRecord[];
  invalid: string[];
  cameraOptions: CameraBoundsOptions;
}

export interface PopupDetails {
  options: PopupOptions;
  properties: { name: string; id: string; entityName: string; description: string };
  isVisible: boolean;
}
