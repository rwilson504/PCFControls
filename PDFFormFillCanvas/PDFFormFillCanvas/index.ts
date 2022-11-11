import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { Base64 } from 'js-base64';
import * as ImageType from 'image-type'
import { PDFButton, PDFCheckBox, PDFDocument, PDFDropdown, PDFForm, PDFRadioGroup, PDFTextField } from 'pdf-lib';
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class PDFFormFillCanvas implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged: () => void;
	private _output: any;
	private _outputErrorMessage: string;	

	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void)
	{
		context.mode.trackContainerResize(true);
		this._notifyOutputChanged = notifyOutputChanged;			
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void>
	{		
		var params = context.parameters;
		if (!params.pdfTemplate?.raw || !params.fillPDF.raw) return;
				
		this._outputErrorMessage = "";

		try {

			this._output = `data:application/pdf;base64,${await this.PDFLibCreation(context)}`;											
		}
		catch(e)
		{
			this._outputErrorMessage = `ERROR: The PDF form fill ran into an error.  MESSAGE: ${(e instanceof Error) ? e.message : String(e)}`;
			this._output = '';	
		}

		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{	
		let output : IOutputs = {
			pdfOutput : this._output || '',
			outputErrorMessage: this._outputErrorMessage,
			outputError: !!this._outputErrorMessage,
			fillPDF: false
		};		

		return output;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	public async PDFLibCreation(pcfContext: ComponentFramework.Context<IInputs>):Promise<string>{
		var params = pcfContext.parameters;
		var dataSet = pcfContext.parameters.formDataSet;

		const pdfDoc = await PDFDocument.load(this.convertStringToBinary(params.pdfTemplate.raw!),{ignoreEncryption: true});

		const form = pdfDoc.getForm();
		await this.parseDataSet(dataSet, form, pdfDoc);
	
		const pdfBytes = await pdfDoc.save()
		return Base64.fromUint8Array(pdfBytes);
	}

	public async parseDataSet(dataSet: DataSet, form: PDFForm, pdfDoc: PDFDocument)
	{
		let totalRecordCount = dataSet.sortedRecordIds.length;
		for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
			var record = dataSet.records[recordId] as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
			
			let fieldName = record.getValue('name') as string;
			let fieldData = record.getValue('data') || '';

			await this.fillField(fieldName, fieldData, form, pdfDoc);
		}
	}

	public async fillField(name: string, data: any, form: PDFForm, pdfDoc: PDFDocument)
	{
		let fieldType = form.getFieldMaybe(name);
		if (!fieldType) return;
		switch(fieldType.constructor.name)
		{			
			case PDFTextField.name: {
				let textField = form.getTextField(name);
				textField.setText(data);
				break;
			}
			case PDFCheckBox.name: {
				let checkboxField = form.getCheckBox(name);				
				if (this.strToBool(data)) {
					checkboxField.check();
				}
				else{					
					checkboxField.uncheck();
				}
				break;
			}
			case PDFRadioGroup.name: {
				let radioButtonField = form.getRadioGroup(name);
				let radioButtonOptions = radioButtonField.getOptions();
				if (radioButtonOptions.find(option => option === data)) radioButtonField.select(data);				
				break;
			}
			case PDFDropdown.name: {
				let dropdownField = form.getDropdown(name);
				let dropdownOptions = dropdownField.getOptions();
				if (dropdownOptions.find(option => option === data)) dropdownField.select(data);
				break;
			}
			case PDFButton.name: {
				const imageArray = this.convertStringToBinary(data);				
				let imageType = ImageType(imageArray);
				if (imageType?.ext === 'jpg')
				{
					const imageBytes = await pdfDoc.embedJpg(data);
					let buttonField = form.getButton(name);
					buttonField.setImage(imageBytes);
				}
				else if(imageType?.ext === 'png'){
					const imageBytes = await pdfDoc.embedPng(data);
					let buttonField = form.getButton(name);
					buttonField.setImage(imageBytes);
				}			
				break;
			}
		}
	}

	public convertStringToBinary = (pdfString:string) => {
		const BASE64_MARKER = ';base64,';
		const base64Index = pdfString.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
		const base64 = pdfString.substring(base64Index);
		return Base64.toUint8Array(base64);
	};

	public strToBool(s: string)
	{
		// will match one and only one of the string 'true','1', or 'on' regardless
		// of capitalization and regardless off surrounding white-space.
		//
		let regex=/^\s*(true|1|on|checked|yes)\s*$/i
		return regex.test(s);
	}
}