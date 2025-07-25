/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFFormattingOptions {
  formatCurrency?: (value: number, precision?: number, symbol?: string) => string;
  formatDecimal?: (value: number, precision?: number) => string;
  formatDateAsFilterStringInUTC?: (value: Date, includeTime?: boolean) => string;
  formatDateLong?: (value: Date) => string;
  formatDateLongAbbreviated?: (value: Date) => string;
  formatDateShort?: (value: Date, includeTime?: boolean) => string;
  formatDateYearMonth?: (value: Date) => string;
  formatInteger?: (value: number) => string;
  formatLanguage?: (value: number) => string;
  formatTime?: (value: Date, behavior: ComponentFramework.FormattingApi.Types.DateTimeFieldBehavior) => string;
  getWeekOfYear?: (value: Date) => number;
}

export class MockPCFFormatting implements ComponentFramework.Formatting {
  private _formatCurrency?: (value: number, precision?: number, symbol?: string) => string;
  private _formatDecimal?: (value: number, precision?: number) => string;
  private _formatDateAsFilterStringInUTC?: (value: Date, includeTime?: boolean) => string;
  private _formatDateLong?: (value: Date) => string;
  private _formatDateLongAbbreviated?: (value: Date) => string;
  private _formatDateShort?: (value: Date, includeTime?: boolean) => string;
  private _formatDateYearMonth?: (value: Date) => string;
  private _formatInteger?: (value: number) => string;
  private _formatLanguage?: (value: number) => string;
  private _formatTime?: (value: Date, behavior: ComponentFramework.FormattingApi.Types.DateTimeFieldBehavior) => string;
  private _getWeekOfYear?: (value: Date) => number;

  constructor(options: MockPCFFormattingOptions = {}) {
    this._formatCurrency = options.formatCurrency;
    this._formatDecimal = options.formatDecimal;
    this._formatDateAsFilterStringInUTC = options.formatDateAsFilterStringInUTC;
    this._formatDateLong = options.formatDateLong;
    this._formatDateLongAbbreviated = options.formatDateLongAbbreviated;
    this._formatDateShort = options.formatDateShort;
    this._formatDateYearMonth = options.formatDateYearMonth;
    this._formatInteger = options.formatInteger;
    this._formatLanguage = options.formatLanguage;
    this._formatTime = options.formatTime;
    this._getWeekOfYear = options.getWeekOfYear;
  }

  formatCurrency(value: number, precision?: number, symbol?: string): string {
    if (this._formatCurrency) {
      return this._formatCurrency(value, precision, symbol);
    }
    throw new Error("Method not implemented.");
  }
  formatDecimal(value: number, precision?: number): string {
    if (this._formatDecimal) {
      return this._formatDecimal(value, precision);
    }
    throw new Error("Method not implemented.");
  }
  formatDateAsFilterStringInUTC(value: Date, includeTime?: boolean): string {
    if (this._formatDateAsFilterStringInUTC) {
      return this._formatDateAsFilterStringInUTC(value, includeTime);
    }
    throw new Error("Method not implemented.");
  }
  formatDateLong(value: Date): string {
    if (this._formatDateLong) {
      return this._formatDateLong(value);
    }
    throw new Error("Method not implemented.");
  }
  formatDateLongAbbreviated(value: Date): string {
    if (this._formatDateLongAbbreviated) {
      return this._formatDateLongAbbreviated(value);
    }
    throw new Error("Method not implemented.");
  }
  formatDateShort(value: Date, includeTime?: boolean): string {
    if (this._formatDateShort) {
      return this._formatDateShort(value, includeTime);
    }
    throw new Error("Method not implemented.");
  }
  formatDateYearMonth(value: Date): string {
    if (this._formatDateYearMonth) {
      return this._formatDateYearMonth(value);
    }
    throw new Error("Method not implemented.");
  }
  formatInteger(value: number): string {
    if (this._formatInteger) {
      return this._formatInteger(value);
    }
    throw new Error("Method not implemented.");
  }
  formatLanguage(value: number): string {
    if (this._formatLanguage) {
      return this._formatLanguage(value);
    }
    throw new Error("Method not implemented.");
  }
  formatTime(value: Date, behavior: ComponentFramework.FormattingApi.Types.DateTimeFieldBehavior): string {
    if (this._formatTime) {
      return this._formatTime(value, behavior);
    }
    throw new Error("Method not implemented.");
  }
  getWeekOfYear(value: Date): number {
    if (this._getWeekOfYear) {
      return this._getWeekOfYear(value);
    }
    throw new Error("Method not implemented.");
  }
}
