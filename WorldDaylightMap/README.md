# World Daylight Map PCF Component
This PCF component utilizes [world-daylight-map](https://github.com/d-w-d/world-daylight-map), enabling you to embed a map of the world with a daylight/night-time overlay within a Canvas Power App. 

![World Daylight Map Sample](https://github.com/rwilson504/PCFControls/blob/master/WorldDaylightMap/images/world-daylight-map.png?raw=true?raw=true)

## Installation
[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/RAWWorldDaylightMap_managed.zip)

### Prerequisite
Make sure you have enabled PCF components for Canvas apps in your environment.  For instructions on that [Click Here](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps)

### Import PCF Component Solution
- Download the managed solution provided in the Release are of this repo. [RAWWorldDaylightMap_managed.zip](https://github.com/rwilson504/PCFControls/releases/latest/download/RAWWorldDaylightMap_managed.zip)
- Navigate to https://make.powerapps.com
- Click on Solution area
- Click **Import** button on the ribbon and select the RAWWorldDaylightMap_managed.zip file you downloaded.
- Follow the import wizard and wait for solution to import. 

### Import Sample App
- Download the sample app file [World Daylight Map.msapp](https://github.com/rwilson504/PCFControls/raw/master/WorldDaylightMap/Sample/World%20Daylight%20Map.msapp)
- Navigate to https://create.powerapps.com
- Click on Open from menu
- In the Open menu select **Browse** and choose the World Daylight Map.msapp file you downloaded
- Click the **Open app** button on the "This app may contain unsafe code" dialog.
- If an "Update code components" dialog appears click the **Update** button.
- The app will now open Power Apps Canvas Studio.
- Choose **File** from the ribbon and save the app to your environment.

## Control Properties
| Name | Mode | Type | Description | Default |
|---|---|---|---| --- |
|Refresh|Input| Boolean | Setting this value to true will refresh the map.|False|
|Controls Position|Input| Enum | The position of the control on the map.|Outer Top|
|Controls Scale|Input|Decimal|Takes a value between 0 and 1, scales the size of the controls box.|0|
|Font|Output|SingleLine.Text|Standard CSS string; you need to make the font available within your CSS setup.|'Roboto', sans-serif|
|Font Size|Output|SingleLine.Text|By default, this property has value 0, which causes the library to automatically scale your text based upon the width of the container. You can override this scaling-font size by an absolute value.||
|Is Sunshine Displayed|Output|Boolean|Controls whether or not to display a radial gradient to mimic the sunshine on the earths surface. Default is true.|True|

## Sample App
A sample app is included under the Sample folder of this project which you can import into your environment once you have deployed the PCF solution.
