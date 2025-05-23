/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFModeOptions {
  allocatedHeight?: number;
  allocatedWidth?: number;
  isControlDisabled?: boolean;
  isVisible?: boolean;
  label?: string;
  contextInfo?: {
    entityId?: string;
    entityTypeName?: string;
    entityRecordName?: string;
    [key: string]: any;
  };
}

export class MockPCFMode implements ComponentFramework.Mode {
  allocatedHeight: number;
  allocatedWidth: number;
  isControlDisabled: boolean;
  isVisible: boolean;
  label: string;
  // Add contextInfo property for custom context usage
  contextInfo?: {
    entityId?: string;
    entityTypeName?: string;
    entityRecordName?: string;
    [key: string]: any;
  };

  constructor(options: MockPCFModeOptions = {}) {
    this.allocatedHeight = options.allocatedHeight ?? 600;
    this.allocatedWidth = options.allocatedWidth ?? 800;
    this.isControlDisabled = options.isControlDisabled ?? false;
    this.isVisible = options.isVisible ?? true;
    this.label = options.label ?? "Mock Mode";
    this.contextInfo = options.contextInfo;
  }

  setControlState(state: ComponentFramework.Dictionary): boolean {
    throw new Error("Method not implemented.");
  }
  setFullScreen(value: boolean): void {
    throw new Error("Method not implemented.");
  }
  trackContainerResize(value: boolean): void {
    throw new Error("Method not implemented.");
  }
}
