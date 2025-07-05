/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFUtilityOptions {
  getEntityMetadata?: (
    entityName: string,
    attributes?: string[]
  ) => Promise<ComponentFramework.PropertyHelper.EntityMetadata>;
  hasEntityPrivilege?: (
    entityTypeName: string,
    privilegeType: ComponentFramework.PropertyHelper.Types.PrivilegeType,
    privilegeDepth: ComponentFramework.PropertyHelper.Types.PrivilegeDepth
  ) => boolean;
  lookupObjects?: (
    lookupOptions: ComponentFramework.UtilityApi.LookupOptions
  ) => Promise<ComponentFramework.LookupValue[]>;
}

export class MockPCFUtility implements ComponentFramework.Utility {
  private _getEntityMetadata?: (
    entityName: string,
    attributes?: string[]
  ) => Promise<ComponentFramework.PropertyHelper.EntityMetadata>;
  private _hasEntityPrivilege?: (
    entityTypeName: string,
    privilegeType: ComponentFramework.PropertyHelper.Types.PrivilegeType,
    privilegeDepth: ComponentFramework.PropertyHelper.Types.PrivilegeDepth
  ) => boolean;
  private _lookupObjects?: (
    lookupOptions: ComponentFramework.UtilityApi.LookupOptions
  ) => Promise<ComponentFramework.LookupValue[]>;

  constructor(options: MockPCFUtilityOptions = {}) {
    this._getEntityMetadata = options.getEntityMetadata;
    this._hasEntityPrivilege = options.hasEntityPrivilege;
    this._lookupObjects = options.lookupObjects;
  }

  getEntityMetadata(
    entityName: string,
    attributes?: string[] | undefined,
  ): Promise<ComponentFramework.PropertyHelper.EntityMetadata> {
    if (this._getEntityMetadata) {
      return this._getEntityMetadata(entityName, attributes);
    }
    throw new Error("Method not implemented.");
  }

  hasEntityPrivilege(
    entityTypeName: string,
    privilegeType: ComponentFramework.PropertyHelper.Types.PrivilegeType,
    privilegeDepth: ComponentFramework.PropertyHelper.Types.PrivilegeDepth,
  ): boolean {
    if (this._hasEntityPrivilege) {
      return this._hasEntityPrivilege(entityTypeName, privilegeType, privilegeDepth);
    }
    throw new Error("Method not implemented.");
  }

  lookupObjects(
    lookupOptions: ComponentFramework.UtilityApi.LookupOptions,
  ): Promise<ComponentFramework.LookupValue[]> {
    if (this._lookupObjects) {
      return this._lookupObjects(lookupOptions);
    }
    throw new Error("Method not implemented.");
  }
}
