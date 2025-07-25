export interface MockPCFFactoryOptions {
  getPopupService?: () => ComponentFramework.FactoryApi.Popup.PopupService;
  requestRender?: () => void;
}

export class MockPCFFactory implements ComponentFramework.Factory {
  private _getPopupService?: () => ComponentFramework.FactoryApi.Popup.PopupService;
  private _requestRender?: () => void;

  constructor(options: MockPCFFactoryOptions = {}) {
    this._getPopupService = options.getPopupService;
    this._requestRender = options.requestRender;
  }

  getPopupService(): ComponentFramework.FactoryApi.Popup.PopupService {
    if (this._getPopupService) {
      return this._getPopupService();
    }
    throw new Error("Method not implemented.");
  }

  requestRender(): void {
    if (this._requestRender) {
      this._requestRender();
      return;
    }
    throw new Error("Method not implemented.");
  }
}
