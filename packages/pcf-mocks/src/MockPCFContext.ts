import { MockPCFClient } from "./MockPCFClient";
import { MockPCFDevice } from "./MockPCFDevice";
import { MockPCFFactory } from "./MockPCFFactory";
import { MockPCFFormatting } from "./MockPCFFormatting";
import { MockPCFMode } from "./MockPCFMode";
import { MockPCFNavigation } from "./MockPCFNavigation";
import { MockPCFResources } from "./MockPCFResources";
import { MockPCFUserSettings } from "./MockPCFUserSettings";
import { MockPCFUtility } from "./MockPCFUtility";
import { MockPCFWebApi } from "./MockPCFWebApi";
import { MockPCFParameters, MockPCFParameterValue } from "./MockPCFParameters";

type IEvents = ComponentFramework.IEventBag;

export class MockPCFContext<TInputs = any> implements ComponentFramework.Context<TInputs> {
  constructor(initialParams?: Record<string, MockPCFParameterValue>) {
    this.client = new MockPCFClient();
    this.device = new MockPCFDevice();
    this.factory = new MockPCFFactory();
    this.formatting = new MockPCFFormatting();
    this.mode = new MockPCFMode();
    this.navigation = new MockPCFNavigation();
    this.resources = new MockPCFResources();
    this.userSettings = new MockPCFUserSettings();
    this.utils = new MockPCFUtility();
    this.webAPI = new MockPCFWebApi();
    this.events = {} as IEvents;
    this.parameters = new MockPCFParameters(initialParams) as unknown as TInputs;
  }
  client: ComponentFramework.Client;
  device: ComponentFramework.Device;
  factory: ComponentFramework.Factory;
  formatting: ComponentFramework.Formatting;
  mode: ComponentFramework.Mode;
  navigation: ComponentFramework.Navigation;
  resources: ComponentFramework.Resources;
  userSettings: ComponentFramework.UserSettings;
  utils: ComponentFramework.Utility;
  webAPI: ComponentFramework.WebApi;
  parameters: TInputs;
  updatedProperties: string[] = [];
  events: IEvents;
}
