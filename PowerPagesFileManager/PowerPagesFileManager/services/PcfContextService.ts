import { Theme } from "@fluentui/react-components";
import { IInputs } from "../generated/ManifestTypes";
import { getLayout, Layout } from "../utils/layouts";
import { generateLightTheme, generateDarkTheme } from "../utils/themeGenerator";

export interface IPcfContextServiceProps {
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  updatePrimaryProperty: (value: string | undefined) => void;
}

export class PcfContextService {
  instanceid: string;
  context: ComponentFramework.Context<IInputs>;
  theme: Theme;
  layout: Layout;
  language: string;
  allowMultipleFiles: boolean;
  allowedFileTypes: string;
  allowedMimeTypes: string;
  uploadSizeLimitKB: number;
  maxNumberOfFiles: number;
  maxGridHeight: number;
  displayAllFiles: boolean;
  updatePrimaryProperty: (value: string | undefined) => void;

  constructor(props: IPcfContextServiceProps) {
    this.instanceid = props.instanceid;
    this.context = props.context;
    const themeColor = props.context.parameters.themeColor?.raw ?? "#0F6CBD";
    const themeMode = props.context.parameters.themeDarkMode?.raw ?? false;
    this.theme = themeMode === true ? generateDarkTheme(themeColor) : generateLightTheme(themeColor);
    this.language = props.context.parameters.language?.raw ?? "en";
    this.allowMultipleFiles =
      props.context.parameters.allowMultipleFiles?.raw ?? true;
    this.allowedFileTypes =
      props.context.parameters.allowedFileTypes?.raw ?? "";
    this.allowedMimeTypes =
      props.context.parameters.allowedMimeTypes?.raw ?? "";
    this.uploadSizeLimitKB =
      props.context.parameters.uploadSizeLimitKB?.raw ?? 10485760;
    this.maxNumberOfFiles = this.allowMultipleFiles
      ? props.context.parameters.maxNumberOfFiles?.raw ?? 0
      : 1;
    this.maxGridHeight = props.context.parameters.maxGridHeight?.raw ?? 0;
    this.displayAllFiles = props.context.parameters.displayAllFiles?.raw ?? true;
    this.layout = getLayout(props.context.parameters?.layout.raw ?? "Vertical");
    this.updatePrimaryProperty = props.updatePrimaryProperty;
  }

  public inDesignMode(): boolean {
    // Handles commercial cloud, GCC, GCC High, DoD maker portal URLs, and PowerPages URLs
    const designModePatterns = [
      /make(\.preview)?\.powerapps\.com/, // Commercial (supports preview)
      /make\.gov\.powerapps\.us/, // GCC
      /make\.high\.powerapps\.us/, // GCC High
      /make\.apps\.appsplatform\.us/, // DoD
      /.*\.powerpages\.microsoft\.com/, // PowerPages
    ];

    const currentUrl = window.location.href;
    return designModePatterns.some((pattern) => pattern.test(currentUrl));
  }

  public getEntityTypeName(): string {
    // @ts-expect-error This will be on the portal
    return this.context.mode.contextInfo.entityTypeName;
  }

  public getEntityId(): string {
    // @ts-expect-error This will be on the portal
    return this.context.mode.contextInfo.entityId;
  }

  public isControlDisabled(): boolean {
    return this.context.mode.isControlDisabled;
  }

  public isVisible(): boolean {
    return this.context.mode.isVisible;
  }
}
