/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFResourcesOptions {
  getResource?: (id: string, success: (data: string) => void, failure: () => void) => void;
  getString?: (id: string) => string;
}

export class MockPCFResources implements ComponentFramework.Resources {
  private _getResource?: (id: string, success: (data: string) => void, failure: () => void) => void;
  private _getString?: (id: string) => string;

  constructor(options: MockPCFResourcesOptions = {}) {
    this._getResource = options.getResource;
    this._getString = options.getString;
  }

  getResource(id: string, success: (data: string) => void, failure: () => void): void {
    if (this._getResource) {
      this._getResource(id, success, failure);
    } else {
      throw new Error("Method not implemented.");
    }
  }

  getString(id: string): string {
    if (this._getString) {
      return this._getString(id);
    }
    throw new Error("Method not implemented.");
  }
}
