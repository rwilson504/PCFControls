PCF/REACT BING MAPS
================

# Overview
A PCF Control that allows you to display view information containing latitude and longitude information with Bing Maps.  The Info Box for each pushpin that is created on the map also gives you the ability to open the selected record.

![Bing Maps Control Demonstration](https://github.com/rwilson504/Blogger/blob/master/Bing-Maps-Control/images/bing-maps-control.gif?raw=true)

[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/BingMapsGridControl_managed.zip)

# Additional Features
* Map will default to a bounding box defined by the location data being shown.
* Will work with dataset that are 5k+ in size.
* Info bar with Record Count and List of Invalid/Empty Location

# Configuration Options

**NOTE:** Any of the data columns you define in the properties must also be present on your view.

**Bing Maps API Key** (Required) - Enter your Bing Maps API Key.  You can obtain a dev/test key from [here.](https://www.bingmapsportal.com/)

**Primary Field** (Required) - Enter the schema name of the field on the view which will be used to generate the title of the Info Box that will be shown when hovering over a pushpin.

**Latitude Field** (Required) - Enter the Latitude field schema name. For related entities use the following format (new_entityname.new_fieldname)

**Longitude Field** (Required) - Enter the Latitude field schema name. For related entities use the following format (new_entityname.new_fieldname)

**Description Field** - Enter the schema name of the field on the view which will displayed in the Info Box that will be shown when hovering over a pushpin.

**Pushpin Color Field** - Enter the Pushpin Color field schema name if available, this field should contain a hex value for the color. For related entities use the following format (new_entityname.new_fieldname)

**Default Pushpin Color** - Enter a hex value for the default color of the Pushpins(example: #ffffff).  Otherwise the default Bing Maps color will be used.  Also this default color will be overwritten with specific colors if the Pushpin Color Field is also utilized and that field contains data.

**Clustering Enabled** - Set to true or false

**Clustering Placement** - Mean Average or First Location [See Definitions](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/clustering-module/clusterplacementtype-enumeration)

**Cluster Grid Size** - The width and height of the gird cells used for clustering in pixels

**Cluster Pushpin Color** - Set the color to a hex value to distinguish the difference between a cluster pin and a regular pin.  If you don't set it the default with be the default pin color.

## Installation Usage
After you install the solution into your system create a new view and add the custom control to the view.  Ensure you add the required fields to the view and any filter you want.  After you create the view Publish the customizations and navigate to the new view.  The video below provides additional details.

![Bing Maps Control installation Usage](https://github.com/rwilson504/Blogger/blob/master/Bing-Maps-Control/images/bingmapcontrolusage.gif?raw=true)
