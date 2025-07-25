export interface MockPCFDeviceOptions {
  barcodeValue?: string;
  position?: ComponentFramework.DeviceApi.Position;
  fileObject?: ComponentFramework.FileObject;
  fileObjects?: ComponentFramework.FileObject[];
}

export class MockPCFDevice implements ComponentFramework.Device {
  private barcodeValue: string;
  private position: ComponentFramework.DeviceApi.Position;
  private fileObject: ComponentFramework.FileObject;
  private fileObjects: ComponentFramework.FileObject[];

  constructor(options: MockPCFDeviceOptions = {}) {
    this.barcodeValue = options.barcodeValue ?? "mock-barcode";
    this.position = options.position ?? ({} as ComponentFramework.DeviceApi.Position);
    this.fileObject = options.fileObject ?? ({} as ComponentFramework.FileObject);
    this.fileObjects = options.fileObjects ?? [];
  }

  captureAudio(): Promise<ComponentFramework.FileObject> {
    return Promise.resolve(this.fileObject);
  }

  captureImage(
    _options?: ComponentFramework.DeviceApi.CaptureImageOptions | undefined,
  ): Promise<ComponentFramework.FileObject> {
    return Promise.resolve(this.fileObject);
  }

  captureVideo(): Promise<ComponentFramework.FileObject> {
    return Promise.resolve(this.fileObject);
  }

  getBarcodeValue(): Promise<string> {
    return Promise.resolve(this.barcodeValue);
  }

  getCurrentPosition(): Promise<ComponentFramework.DeviceApi.Position> {
    return Promise.resolve(this.position);
  }

  pickFile(
    _options?: ComponentFramework.DeviceApi.PickFileOptions | undefined,
  ): Promise<ComponentFramework.FileObject[]> {
    return Promise.resolve(this.fileObjects);
  }
}
