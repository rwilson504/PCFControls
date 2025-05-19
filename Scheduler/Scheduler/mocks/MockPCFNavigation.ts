/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFNavigationOptions {
  openAlertDialog?: (
    alertStrings: ComponentFramework.NavigationApi.AlertDialogStrings,
    options?: ComponentFramework.NavigationApi.AlertDialogOptions
  ) => Promise<void>;
  openConfirmDialog?: (
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions
  ) => Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse>;
  openErrorDialog?: (
    options: ComponentFramework.NavigationApi.ErrorDialogOptions
  ) => Promise<void>;
  openFile?: (
    file: ComponentFramework.FileObject,
    options?: ComponentFramework.NavigationApi.OpenFileOptions
  ) => Promise<void>;
  openForm?: (
    options: ComponentFramework.NavigationApi.EntityFormOptions,
    parameters?: { [key: string]: string }
  ) => Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse>;
  openUrl?: (
    url: string,
    options?: ComponentFramework.NavigationApi.OpenUrlOptions
  ) => void;
  openWebResource?: (
    name: string,
    options?: ComponentFramework.NavigationApi.OpenWebResourceOptions,
    data?: string
  ) => void;
}

export class MockPCFNavigation implements ComponentFramework.Navigation {
  private _openAlertDialog?: (
    alertStrings: ComponentFramework.NavigationApi.AlertDialogStrings,
    options?: ComponentFramework.NavigationApi.AlertDialogOptions
  ) => Promise<void>;
  private _openConfirmDialog?: (
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions
  ) => Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse>;
  private _openErrorDialog?: (
    options: ComponentFramework.NavigationApi.ErrorDialogOptions
  ) => Promise<void>;
  private _openFile?: (
    file: ComponentFramework.FileObject,
    options?: ComponentFramework.NavigationApi.OpenFileOptions
  ) => Promise<void>;
  private _openForm?: (
    options: ComponentFramework.NavigationApi.EntityFormOptions,
    parameters?: { [key: string]: string }
  ) => Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse>;
  private _openUrl?: (
    url: string,
    options?: ComponentFramework.NavigationApi.OpenUrlOptions
  ) => void;
  private _openWebResource?: (
    name: string,
    options?: ComponentFramework.NavigationApi.OpenWebResourceOptions,
    data?: string
  ) => void;

  constructor(options: MockPCFNavigationOptions = {}) {
    this._openAlertDialog = options.openAlertDialog;
    this._openConfirmDialog = options.openConfirmDialog;
    this._openErrorDialog = options.openErrorDialog;
    this._openFile = options.openFile;
    this._openForm = options.openForm;
    this._openUrl = options.openUrl;
    this._openWebResource = options.openWebResource;
  }

  openAlertDialog(
    alertStrings: ComponentFramework.NavigationApi.AlertDialogStrings,
    options?: ComponentFramework.NavigationApi.AlertDialogOptions
  ): Promise<void> {
    if (this._openAlertDialog) {
      return this._openAlertDialog(alertStrings, options);
    }
    throw new Error("Method not implemented.");
  }

  openConfirmDialog(
    confirmStrings: ComponentFramework.NavigationApi.ConfirmDialogStrings,
    options?: ComponentFramework.NavigationApi.ConfirmDialogOptions
  ): Promise<ComponentFramework.NavigationApi.ConfirmDialogResponse> {
    if (this._openConfirmDialog) {
      return this._openConfirmDialog(confirmStrings, options);
    }
    throw new Error("Method not implemented.");
  }

  openErrorDialog(
    options: ComponentFramework.NavigationApi.ErrorDialogOptions
  ): Promise<void> {
    if (this._openErrorDialog) {
      return this._openErrorDialog(options);
    }
    throw new Error("Method not implemented.");
  }

  openFile(
    file: ComponentFramework.FileObject,
    options?: ComponentFramework.NavigationApi.OpenFileOptions
  ): Promise<void> {
    if (this._openFile) {
      return this._openFile(file, options);
    }
    throw new Error("Method not implemented.");
  }

  openForm(
    options: ComponentFramework.NavigationApi.EntityFormOptions,
    parameters?: { [key: string]: string }
  ): Promise<ComponentFramework.NavigationApi.OpenFormSuccessResponse> {
    if (this._openForm) {
      return this._openForm(options, parameters);
    }
    throw new Error("Method not implemented.");
  }

  openUrl(
    url: string,
    options?: ComponentFramework.NavigationApi.OpenUrlOptions
  ): void {
    if (this._openUrl) {
      this._openUrl(url, options);
      return;
    }
    throw new Error("Method not implemented.");
  }

  openWebResource(
    name: string,
    options?: ComponentFramework.NavigationApi.OpenWebResourceOptions,
    data?: string
  ): void {
    if (this._openWebResource) {
      this._openWebResource(name, options, data);
      return;
    }
    throw new Error("Method not implemented.");
  }
}
