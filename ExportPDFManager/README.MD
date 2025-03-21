# Export PDF Manager Control

![Export PDF Manager Control Screen Shot](./images/export-pdf-manager-screenshot.png)

## Introduction
The Export PDF Manager Control is a Power Apps Component Framework (PCF) control designed to simplify the management and configuration of the "Export to PDF" functionality within model-driven apps. This control provides an intuitive interface to enable or disable PDF export capabilities, configure PDF generation settings, and manage visibility and availability of the Export to PDF button based on specific business requirements.

This control is particularly useful for administrators and developers who need to quickly adjust PDF export settings without manually editing XML or using complex scripts. It streamlines the process of enabling PDF export functionality, ensuring consistency and reducing the risk of errors.

## Features
- **Enable/Disable Export to PDF**: Quickly toggle the availability of the Export to PDF button.
- **Dynamic Configuration**: Adjust PDF export settings dynamically based on form context or user roles.
- **Ribbon Customization**: Easily manage ribbon visibility and button availability without manual XML editing.
- **Integration with PowerShell and Ribbon Workbench**: Supports configuration via PowerShell scripts and Ribbon Workbench for advanced scenarios.
- **Fluent UI Integration**: Built using Fluent UI 9 for a consistent and modern user experience.
- **Multi-language Support**: Supports multiple languages including English, Spanish, French, Korean, Japanese, German, Portuguese, and Arabic.
- **Theme Support**: Adapts seamlessly to the built-in model-driven app theme or custom themes applied in canvas apps.

## Available Properties

| Property Name  | Description                                                | Type            | Default Value |
|----------------|------------------------------------------------------------|-----------------|---------------|
| boundProperty  | The primary bound property for the control context.        | SingleLine.Text | N/A           |
| height         | Height of the control in pixels.                           | Whole.None      | 500           |

## Configuration Methods
You can configure the Export to PDF functionality using several methods:

### Using PowerShell
You can enable or disable the Export to PDF button using PowerShell scripts. Refer to the detailed instructions provided in the following article:
[Enable Export to PDF Button using PowerShell](https://www.richardawilson.com/2021/06/enable-export-to-pdf-button-ribbon.html#powershell)

### Using Ribbon Workbench
Ribbon Workbench allows you to visually manage ribbon buttons and commands. Follow the steps outlined here:
[Enable Export to PDF Button using Ribbon Workbench](https://www.richardawilson.com/2021/06/enable-export-to-pdf-button-ribbon.html#ribbonworkbench)

### Manual XML Editing
For advanced users, manual XML editing is also supported. Detailed instructions can be found here:
[Enable Export to PDF Button using Manual XML Editing](https://www.richardawilson.com/2021/06/enable-export-to-pdf-button-ribbon.html#manualxml)

## Installation

[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/ExportPDFManager_managed.zip)

[Import the solution file](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/import-update-export-solutions)

### Model-driven Apps
[Implementing code components for Model-driven Apps](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/code-components-model-driven-apps#implementing-code-components)

### Canvas Apps
Enable PCF for Canvas in your environment. [Enable the Power Apps component framework feature](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps)

[Implementing code components in Canvas](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps#implementing-code-components)

## Shoutouts
Special thanks to the community contributors who inspired and supported this control development:
- [Scott Durow](https://www.linkedin.com/in/scottdurow/) for the Ribbon Workbench tool.
- [Microsoft Power Apps Community](https://powerusers.microsoft.com/) for continuous support and resources.