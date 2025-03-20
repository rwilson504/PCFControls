import { Theme } from "@fluentui/react-components";
import { IInputs } from "../generated/ManifestTypes";

export interface IPcfContextServiceProps {
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  height: number;
}

const SmallFormFactorMaxWidth = 350;

const enum FormFactors {
  Unknown = 0,
  Desktop = 1,
  Tablet = 2,
  Phone = 3,
}

interface ContextInfo {
  entityTypeName: string;
  entityId: string;
}

export class PcfContextService {
  instanceid: string;
  context: ComponentFramework.Context<IInputs>;
  theme: Theme;
  formFactor: string;
  height: number;

  constructor(props: IPcfContextServiceProps) {
    this.instanceid = props.instanceid;
    this.context = props.context;
    this.theme = this.getTheme();
    this.formFactor =
      props.context.client.getFormFactor() == (FormFactors.Phone as number) ||
      props.context.mode.allocatedWidth < SmallFormFactorMaxWidth
        ? "small"
        : "large";
    this.height = props.height;
  }

  public inDesignMode(): boolean {
    // Previously only handled commercial cloud.
    // Updated to also handle GCC, GCC High, and DoD maker portal URLs.
    const designModeUrls = [
      "make.powerapps.com",
      "make.gov.powerapps.us", // GCC
      "make.high.powerapps.us", // GCC High
      "make.apps.appsplatform.us", // DoD
    ];
    const currentUrl = window.location.href;
    return designModeUrls.some((url) => currentUrl.includes(url));
  }

  public isCanvasApp(): boolean {
    return this.context.mode.allocatedHeight !== -1;
  }

  public isControlDisabled(): boolean {
    // Return the control's disabled state from the context
    return this.context.mode.isControlDisabled;
  }

  public isVisible(): boolean {
    return this.context.mode.isVisible;
  }

  public getTheme(): Theme {
    const defaultTheme: Theme = this.context.fluentDesignLanguage
      ?.tokenTheme as Theme;
    return this.isControlDisabled() && !this.isCanvasApp()
      ? {
          ...defaultTheme,
          colorCompoundBrandStroke: defaultTheme?.colorNeutralStroke1,
          colorCompoundBrandStrokeHover: defaultTheme?.colorNeutralStroke1Hover,
          colorCompoundBrandStrokePressed:
            defaultTheme?.colorNeutralStroke1Pressed,
          //colorCompoundBrandStrokeSelected: props.theme?.colorNeutralStroke1Selected,
        }
      : defaultTheme;
  }

  public getEntityTypeName(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityTypeName;
  }

  public getEntityId(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityId;
  }

  // Returns the base URL for the current context in Model-driven apps only.
  // In Canvas apps, this will be undefined.
  public getBaseUrl(): string | undefined {
    if (this.isCanvasApp()) {
      return undefined;
    } else {
      // @ts-expect-error context is available in model apps
      // eslint-disable-next-line
      return this.context.page.getClientUrl();
    }
  }
}
