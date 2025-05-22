//import { Theme } from "@fluentui/react-components";
import { IInputs } from "../generated/ManifestTypes";


// Props for constructing a PcfContextService instance
export interface IPcfContextServiceProps {
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  height: number | string;
}


// Maximum width for small form factor (e.g., phone)
const SmallFormFactorMaxWidth = 350;


// Enum for supported form factors
const enum FormFactors {
  Unknown = 0,
  Desktop = 1,
  Tablet = 2,
  Phone = 3,
}


// Interface for context info (entity type and ID)
interface ContextInfo {
  entityTypeName: string;
  entityId: string;
}


// Service for accessing and managing PCF context and environment details
export class PcfContextService {
  instanceid: string;
  context: ComponentFramework.Context<IInputs>;
  //theme: Theme;
  formFactor: string;
  height: number | string;

  /**
   * Construct a new PcfContextService
   * @param props - context, instanceid, and height for the control
   */
  constructor(props: IPcfContextServiceProps) {
    this.instanceid = props.instanceid;
    this.context = props.context;
    //this.theme = this.getTheme();
    this.formFactor =
      props.context.client.getFormFactor() == (FormFactors.Phone as number) ||
        props.context.mode.allocatedWidth < SmallFormFactorMaxWidth
        ? "small"
        : "large";
    this.height = props.height;
  }


  /**
   * Update the context reference (e.g., on re-render)
   */
  updateContext(context: ComponentFramework.Context<IInputs>) {
    this.context = context;
  }

  /**
   * Returns true if the control is running in the Power Apps designer
   */
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

  /**
   * Returns true if the control is running in a Canvas app
   */
  public isCanvasApp(): boolean {
    return this.context.mode.allocatedHeight !== -1;
  }

  /**
   * Returns true if the control is disabled
   */
  public isControlDisabled(): boolean {
    // Return the control's disabled state from the context
    return this.context.mode.isControlDisabled;
  }

  /**
   * Returns true if the control is visible
   */
  public isVisible(): boolean {
    return this.context.mode.isVisible;
  }

  // public getTheme(): Theme {
  //   const defaultTheme: Theme = this.context.fluentDesignLanguage
  //     ?.tokenTheme as Theme;
  //   return this.isControlDisabled() && !this.isCanvasApp()
  //     ? {
  //         ...defaultTheme,
  //         colorCompoundBrandStroke: defaultTheme?.colorNeutralStroke1,
  //         colorCompoundBrandStrokeHover: defaultTheme?.colorNeutralStroke1Hover,
  //         colorCompoundBrandStrokePressed:
  //           defaultTheme?.colorNeutralStroke1Pressed,
  //       }
  //     : defaultTheme;
  // }

  /**
   * Returns the entity type name from the context (model-driven only)
   */
  public getEntityTypeName(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityTypeName;
  }

  /**
   * Returns the entity ID from the context (model-driven only)
   */
  public getEntityId(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityId;
  }

  // Returns the base URL for the current context in Model-driven apps only.
  // In Canvas apps, this will be undefined.
  /**
   * Returns the base URL for the current context (model-driven only)
   */
  public getBaseUrl(): string | undefined {
    if (this.isCanvasApp()) {
      return undefined;
    } else {
      // @ts-expect-error context is available in model apps      
      return this.context.page.getClientUrl();
    }
  }

  /**
   * Returns a localized string from the context resources
   */
  public getResourceString(key: string): string {
    return this.context.resources.getString(key) || key;
  }

  // If the pcf is in full page mode such as when it's being loaded through the sitemap
  // this will return any parameters that were passed in the URL.
  /**
   * Returns a parameter from the full page URL (model-driven only)
   */
  public getFullPageParam(key: string): string {
    // @ts-expect-error fullPageParam is available in full page mode
    const configuration = this.context.mode.fullPageParam as Record<
      string,
      string
    >;
    if (configuration) {
      const pageParam = configuration[key];
      if (pageParam && typeof pageParam === "string") {
        return pageParam; // Return the raw value if it exists and is a string
      }
    }
    // Return an empty string if the key doesn't exist or the value is invalid
    return "";
  }
}
