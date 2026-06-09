export interface MockPCFClientOptions {
  disableScroll?: boolean;
  formFactor?: number;
  client?: string;
  offline?: boolean;
  networkAvailable?: boolean;
}

export class MockPCFClient implements ComponentFramework.Client {
  disableScroll: boolean;
  private formFactor: number;
  private client: string;
  private offline: boolean;
  private networkAvailable: boolean;

  constructor(options: MockPCFClientOptions = {}) {
    this.disableScroll = options.disableScroll ?? false;
    this.formFactor = options.formFactor ?? 1;
    this.client = options.client ?? "Web";
    this.offline = options.offline ?? false;
    this.networkAvailable = options.networkAvailable ?? true;
  }

  getFormFactor(): number {
    return this.formFactor;
  }

  getClient(): string {
    return this.client;
  }

  isOffline(): boolean {
    return this.offline;
  }

  isNetworkAvailable(): boolean {
    return this.networkAvailable;
  }
}
