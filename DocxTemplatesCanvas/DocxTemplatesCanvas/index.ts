import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TemplateHandler } from "easy-template-x";
import { decode, encode } from "base64-arraybuffer";

const BASE64_MARKER = ";base64,";

export class DocxTemplatesCanvas
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _notifyOutputChanged: () => void;
  private _output: any;
  private _outputErrorMessage: string;
  
  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    context.mode.trackContainerResize(false);
    this._notifyOutputChanged = notifyOutputChanged;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public async updateView(
    context: ComponentFramework.Context<IInputs>
  ): Promise<void> {
    var params = context.parameters;
    if (!params.docxTemplate?.raw || !params.fillTemplate.raw) return;

    this._outputErrorMessage = "";

    try {
      this._output = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${await this.DocxTemplateFill(context)}`;
    } catch (e) {
      this._outputErrorMessage = `ERROR: The Docx template filler ran into an error.  MESSAGE: ${e instanceof Error ? e.message : String(e)}`;
      this._output = "";
    }

    this._notifyOutputChanged();
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    let output: IOutputs = {
      docxOutput: this._output || "",
      outputErrorMessage: this._outputErrorMessage,
      outputError: !!this._outputErrorMessage,
      fillTemplate: false,
    };

    return output;
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }

  public async DocxTemplateFill(
    pcfContext: ComponentFramework.Context<IInputs>
  ): Promise<string> {
    var params = pcfContext.parameters;
    var dataSet = pcfContext.parameters.templateData?.raw || "{}";
    var dataSetObject = JSON.parse(dataSet);    
    await this.updateImagesToArrayBuffer(dataSetObject);

    const handler = new TemplateHandler();    
    const docxFilled = await handler.process(
      this.convertStringToArray(params.docxTemplate.raw!),
      dataSetObject
    );

    return encode(docxFilled);
  }

  private async updateImagesToArrayBuffer(target: any) {
    for (const key in target) {
      const value = target[key];
      // Images have a source property which defines their image data.  
      // This data will be passed in as a base64 string and needs to be converted to an array buffer.
      if (key === 'source' && value.includes(BASE64_MARKER)) {
        target[key] =this.convertStringToArray(value)
      } else if (typeof value === 'object' && value) {
        // if nested object found recurse
        await this.updateImagesToArrayBuffer(value);
      }
    }
  }
  
  private convertStringToArray = (pdfString: string) => {    
    const base64Index = pdfString.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = pdfString.substring(base64Index);
    return decode(base64)   
  };  
}
