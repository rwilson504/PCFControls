export interface MockPCFWebApiOptions {
  createRecord?: (
    entityType: string,
    data: ComponentFramework.WebApi.Entity
  ) => Promise<ComponentFramework.LookupValue>;
  deleteRecord?: (
    entityType: string,
    id: string
  ) => Promise<ComponentFramework.LookupValue>;
  updateRecord?: (
    entityType: string,
    id: string,
    data: ComponentFramework.WebApi.Entity
  ) => Promise<ComponentFramework.LookupValue>;
  retrieveMultipleRecords?: (
    entityType: string,
    options?: string,
    maxPageSize?: number
  ) => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
  retrieveRecord?: (
    entityType: string,
    id: string,
    options?: string
  ) => Promise<ComponentFramework.WebApi.Entity>;
}

export class MockPCFWebApi implements ComponentFramework.WebApi {
  private _createRecord?: (
    entityType: string,
    data: ComponentFramework.WebApi.Entity
  ) => Promise<ComponentFramework.LookupValue>;
  private _deleteRecord?: (
    entityType: string,
    id: string
  ) => Promise<ComponentFramework.LookupValue>;
  private _updateRecord?: (
    entityType: string,
    id: string,
    data: ComponentFramework.WebApi.Entity
  ) => Promise<ComponentFramework.LookupValue>;
  private _retrieveMultipleRecords?: (
    entityType: string,
    options?: string,
    maxPageSize?: number
  ) => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
  private _retrieveRecord?: (
    entityType: string,
    id: string,
    options?: string
  ) => Promise<ComponentFramework.WebApi.Entity>;

  constructor(options: MockPCFWebApiOptions = {}) {
    this._createRecord = options.createRecord;
    this._deleteRecord = options.deleteRecord;
    this._updateRecord = options.updateRecord;
    this._retrieveMultipleRecords = options.retrieveMultipleRecords;
    this._retrieveRecord = options.retrieveRecord;
  }

  createRecord(
    entityType: string,
    data: ComponentFramework.WebApi.Entity
  ): Promise<ComponentFramework.LookupValue> {
    if (this._createRecord) {
      return this._createRecord(entityType, data);
    }
    throw new Error("Method not implemented.");
  }

  deleteRecord(
    entityType: string,
    id: string
  ): Promise<ComponentFramework.LookupValue> {
    if (this._deleteRecord) {
      return this._deleteRecord(entityType, id);
    }
    throw new Error("Method not implemented.");
  }

  updateRecord(
    entityType: string,
    id: string,
    data: ComponentFramework.WebApi.Entity
  ): Promise<ComponentFramework.LookupValue> {
    if (this._updateRecord) {
      return this._updateRecord(entityType, id, data);
    }
    throw new Error("Method not implemented.");
  }

  retrieveMultipleRecords(
    entityType: string,
    options?: string,
    maxPageSize?: number
  ): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
    if (this._retrieveMultipleRecords) {
      return this._retrieveMultipleRecords(entityType, options, maxPageSize);
    }
    throw new Error("Method not implemented.");
  }

  retrieveRecord(
    entityType: string,
    id: string,
    options?: string
  ): Promise<ComponentFramework.WebApi.Entity> {
    if (this._retrieveRecord) {
      return this._retrieveRecord(entityType, id, options);
    }
    throw new Error("Method not implemented.");
  }
}
