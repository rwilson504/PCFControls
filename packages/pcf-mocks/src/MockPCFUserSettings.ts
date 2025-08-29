/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFUserSettingsOptions {
  dateFormattingInfo?: ComponentFramework.UserSettingApi.DateFormattingInfo;
  isRTL?: boolean;
  languageId?: number;
  numberFormattingInfo?: ComponentFramework.UserSettingApi.NumberFormattingInfo;
  securityRoles?: string[];
  userId?: string;
  userName?: string;
  getTimeZoneOffsetMinutes?: (date?: Date) => number;
}

export class MockPCFUserSettings implements ComponentFramework.UserSettings {
  dateFormattingInfo: ComponentFramework.UserSettingApi.DateFormattingInfo;
  isRTL: boolean;
  languageId: number;
  numberFormattingInfo: ComponentFramework.UserSettingApi.NumberFormattingInfo;
  securityRoles: string[];
  userId: string;
  userName: string;
  private _getTimeZoneOffsetMinutes?: (date?: Date) => number;

  constructor(options: MockPCFUserSettingsOptions = {}) {
    this.dateFormattingInfo = options.dateFormattingInfo ?? {} as ComponentFramework.UserSettingApi.DateFormattingInfo;
    this.isRTL = options.isRTL ?? false;
    this.languageId = options.languageId ?? 1033;
    this.numberFormattingInfo = options.numberFormattingInfo ?? {} as ComponentFramework.UserSettingApi.NumberFormattingInfo;
    this.securityRoles = options.securityRoles ?? [];
    this.userId = options.userId ?? "mock-user-id";
    this.userName = options.userName ?? "Mock User";
    this._getTimeZoneOffsetMinutes = options.getTimeZoneOffsetMinutes;
  }

  getTimeZoneOffsetMinutes(date?: Date | undefined): number {
    if (this._getTimeZoneOffsetMinutes) {
      return this._getTimeZoneOffsetMinutes(date);
    }
    throw new Error("Method not implemented.");
  }
}
