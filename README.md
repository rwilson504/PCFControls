[![Build Status](https://dev.azure.com/rickwilson/GitHub-rwilson504/_apis/build/status/rwilson504.PCFControls?branchName=master)](https://dev.azure.com/rickwilson/GitHub-rwilson504/_build/latest?definitionId=5&branchName=master)

# Description
Reusable PowerApps Control Framework (PCF) controls.

# Controls

## Custom Grid/Subgrid Using Office-UI-Fabric DetailsList

![DetailsList Grid Control](https://github.com/rwilson504/Blogger/blob/master/Office-Fabric-UI-DetailsList-PCF/office-fabric-ui-detailslist.gif?raw=true)

Allows you to simulate the out of the box grid and subgrid controls using the Office-UI-Fabric DetailsList control.  It was built to provide a springboard when you need a customizable grid experience.  This component re-creates a mojority of the capabilities available out of the box in less than 300 lines of code and demonstrates the following: 

* Using the DataSet within a React functional component.
* Displaying and sorting data within the Office-UI-Fabric DetailsList component.
* Rendering custom formats for data with the DetailsList component such as links for Entity References, email addresses, and phone numbers.
* Displaying field data for related entities.
* React Hooks - the component uses both useState and useEffect.
* Loading more than 5k records in DataSet.
* Retaining the use of the standard ribbon buttons by using the setSelectedRecordIds function on the DataSet.
* Detecting and responding to control width updates.

## Color Picker
This color picker control utilizes React and the Office-UI-Fabric controls.

![Color Picker Control](https://1.bp.blogspot.com/-DRZqFJPS1e8/XbtAv9zhLZI/AAAAAAABN1Y/Qt5eoWhmTBcW3tplwsLL2plE1bAOmQDGwCLcBGAsYHQ/s1600/PCFColorPicker.gif)

## Bing Maps Control
Connect to bing maps and display information from a Dynamics View.

![Bing Maps Control Demonstration](https://github.com/rwilson504/Blogger/blob/master/Bing-Maps-Control/images/bing-maps-control.gif?raw=true)

## Azure Maps Control
Connect to Azure maps and display information from a Dynamics View.

![Bing Maps Control Demonstration](https://github.com/rwilson504/Blogger/blob/master/Azure-Maps-Control/images/azuremapcontrol.gif?raw=true?raw=true)

## Boolean Optionset
Allows you to utilize a drop down for Boolean fields on the Business Process Flow forms.

# Build
The projects within the solution were built utilizing the [XrmToolBox](https://www.xrmtoolbox.com/) - [PCF Custom Control Builder](https://www.xrmtoolbox.com/plugins/Maverick.PCF.Builder/) by Danish Naglekar.

![PCF Custom Control Builder Screenshot](https://1.bp.blogspot.com/-7r7bRCF23zQ/Xbw7y67L0MI/AAAAAAABN1w/Z5kGoAFduPccyEEULiSDAVLUsdqhZNpcgCLcBGAsYHQ/s640/XrmToolBoxPCFCustomControlBuilder.png)
