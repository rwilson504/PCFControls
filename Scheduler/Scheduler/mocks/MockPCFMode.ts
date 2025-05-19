/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MockPCFModeOptions {
  allocatedHeight?: number;
  allocatedWidth?: number;
  isControlDisabled?: boolean;
  isVisible?: boolean;
  label?: string;
}

export class MockPCFMode implements ComponentFramework.Mode {
  allocatedHeight: number;
  allocatedWidth: number;
  isControlDisabled: boolean;
  isVisible: boolean;
  label: string;

  constructor(options: MockPCFModeOptions = {}) {
    this.allocatedHeight = options.allocatedHeight ?? 600;
    this.allocatedWidth = options.allocatedWidth ?? 800;
    this.isControlDisabled = options.isControlDisabled ?? false;
    this.isVisible = options.isVisible ?? true;
    this.label = options.label ?? "Mock Mode";
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
