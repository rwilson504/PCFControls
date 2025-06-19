# Image Cropper PCF Control

A Power Apps Component Framework (PCF) control for cropping, rotating, and transforming images, built with React and designed for robust, modular, and Power Apps-compliant use.

![Image Cropper Demo](./images/image-cropper-demo.gif)

## Overview

The Image Cropper control provides a modern, accessible, and highly configurable image cropping experience for both Model-driven and Canvas Power Apps. It supports aspect ratio locking, scaling, rotation, circular/elliptical cropping, and advanced browser scaling handling. The control is built with React functional components and custom hooks for maintainability and extensibility.

## Features

- Crop images with drag-and-resize UI
- Lock aspect ratio or allow freeform cropping
- Rotate and scale images
- Circular/elliptical crop support
- Handles browser and container scaling
- Default crop values from manifest
- Robust image load and crop state management
- Outputs cropped image as base64 PNG
- Fully modular React hooks architecture

## Installation

[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/RAW.ImageCropControl_managed.zip)

Import the managed solution into your environment.
Ensure PCF controls are enabled. [Enable PCF](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps)

## Sample Application

A sample solution is available for testing and demonstration:

[Download Sample App](./Sample/RAW%20Image%20Crop.msapp)

## Configuration

Add the Image Cropper control to your form or app and configure the required properties.
**Any field referenced in the properties must be present in your view or data source.**

### Control Properties

| Name                | Usage    | Type             | Required | Default | Description                                                      |
|---------------------|----------|------------------|----------|---------|------------------------------------------------------------------|
| imageInput          | input    | SingleLine.Text  | Yes      |         | Image source (base64 or URL)                                     |
| aspect              | input    | Decimal Number   | No       | 0       | Aspect ratio (width/height), blank for freeform                  |
| minWidth            | input    | Whole.Number     | No       | -1      | Minimum crop width                                               |
| maxWidth            | input    | Whole.Number     | No       | -1      | Maximum crop width                                               |
| minHeight           | input    | Whole.Number     | No       | -1      | Minimum crop height                                              |
| maxHeight           | input    | Whole.Number     | No       | -1      | Maximum crop height                                              |
| rotation            | input    | Whole.Number     | No       | 0       | Image rotation in degrees                                        |
| scaling             | input    | Decimal Number   | No       | 1       | Image scaling factor                                             |
| circularCrop        | input    | TwoOptions       | No       | false   | Enable circular/elliptical crop                                  |
| keepSelection       | input    | TwoOptions       | No       | false   | Keep crop selection after crop                                   |
| locked              | input    | TwoOptions       | No       | false   | Lock crop area (disable editing)                                 |
| disabled            | input    | TwoOptions       | No       | false   | Disable the control                                              |
| ruleOfThirds        | input    | TwoOptions       | No       | false   | Show rule-of-thirds grid                                         |
| DefaultUnit         | input    | OptionSet        | No       | %       | Default crop unit (px or %)                                      |
| DefaultX            | input    | Whole.Number     | No       | -1      | Default crop X position                                          |
| DefaultY            | input    | Whole.Number     | No       | -1      | Default crop Y position                                          |
| DefaultWidth        | input    | Whole.Number     | No       | -1      | Default crop width                                               |
| DefaultHeight       | input    | Whole.Number     | No       | -1      | Default crop height                                              |

### Output Properties

| Name         | Type           | Description                                 |
|--------------|----------------|---------------------------------------------|
| croppedImage | SingleLine.Text| Cropped image as base64 PNG (data URL)      |

## Advanced Usage

- All crop, aspect, and transform logic is modularized in custom React hooks for maintainability.
- The control automatically handles browser scaling, image load timing, and crop validity.
- Circular/elliptical cropping uses canvas ellipse masking for true round crops.
- Default crop values are only applied after the image is loaded.

## Resources

- [PCF Documentation](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview)
- [react-image-crop](https://github.com/dominictarr/react-image-crop)
- [PCF Controls Repo](https://github.com/rwilson504/PCFControls)
