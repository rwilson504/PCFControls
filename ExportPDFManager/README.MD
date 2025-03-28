# Export PDF Manager Control

![Export PDF Manager Control Screen Shot](./images/export-pdf-manager-screenshot.png)

## Introduction
The Export PDF Manager Control is a Power Apps Component Framework (PCF) control designed to simplify the management and configuration of the "Export to PDF" functionality within model-driven apps. This control provides an intuitive interface to enable or disable PDF export capabilities, configure PDF generation settings, and manage visibility and availability of the Export to PDF button based on specific business requirements.

This control is particularly useful for administrators and developers who need to quickly adjust PDF export settings without manually editing XML or using complex scripts. It streamlines the process of enabling PDF export functionality, ensuring consistency and reducing the risk of errors. While there are other ways to configure the Export to PDF functionality, as detailed in my [original article](https://www.richardawilson.com/2021/06/enable-export-to-pdf-button-ribbon.html), this PCF control makes it much easier, especially for those who are not using Dynamics but just Power Apps model apps.

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

## Installation

[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/ExportPDFManager_managed.zip)

[Import the solution file](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/import-update-export-solutions)

### Model-driven Apps
[Implementing code components for Model-driven Apps](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/code-components-model-driven-apps#implementing-code-components)

### Canvas Apps
Enable PCF for Canvas in your environment. [Enable the Power Apps component framework feature](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps)

[Implementing code components in Canvas](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/component-framework-for-canvas-apps#implementing-code-components)

### Using a Settings Entity
For model apps, it is recommended to create a Settings entity to store configuration values such as default queues for sending emails or teams used for specific processes. This entity can be used in workflows and flows to avoid defining these values in each one. To ensure the Settings entity only has one record, create a real-time workflow on creation to set the name to "Settings" and create a key on the Name field. This prevents admins from accidentally creating more than one record.

You can place this PCF component on the Settings entity to manage the Export to PDF functionality centrally.

