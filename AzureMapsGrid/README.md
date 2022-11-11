PCF/REACT AZURE MAPS
================

# Overview
A PCF Control that allows you to display view information containing latitude and longitude information with Azure Maps.

![Azure Maps Control Demonstration](https://github.com/rwilson504/Blogger/blob/master/Azure-Maps-Control/images/azuremapcontrol.gif?raw=true)

# Additional Features
* Map will default to a bounding box defined by the location data being shown.
* Will work with dataset that are 5k+ in size.
* Info bar with Record Count and List of Invalid/Empty Location

# Authentication Configuration

[Download Latest](https://github.com/rwilson504/PCFControls/releases/latest/download/AzureMapsGridControl_managed.zip)

In order to set the authentication for the control the solution includes an entity called 'Azure Maps Config'.  This will allow you to manage the authentication from a central location so that you do not have to set it for each control.

For information on how to set up your Azure Maps account and get your subscription keys you can go [here.](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-account-keys)

- Create an instance of this entity and add you authentication options. (Because the entity is not in the sitemap you can create a new one by searching for it in Advanced Find.)
- Add Read capability to this entity in the Security Roles for your users.

![Azure Maps Config](https://github.com/rwilson504/Blogger/blob/master/Azure-Maps-Control/images/azuremapsconfig.png?raw=true)

NOTE: Currently only the Subscription Key authentication has been tested.  The Azure AD functionality should work but I would love feedback from those using it.  The Anonymous authentication is a bit tricker because you need to supply a getToken function. If you want to attempt the Anonymous authentication ensure you write your function like the one below.  It is important that you utilize the variable name 'url' for the Anonymous url you supply in the config entity as well as ensuring that your fetch function return errors otherwise your users will just see a spinner if there is an auth error.

```function(resolve, reject, map) {
       fetch(url)
		.then(response => {
			return response.text();
		}, error => {
			return error;
		})
		.then(value => {
			resolve(value);
		}, error => {										
			return error;
		})
		.catch(error => {
			return error;
		});
}
```
![Azure Maps Config Anon](https://github.com/rwilson504/Blogger/blob/master/Azure-Maps-Control/images/azuremapsconfiganon.png?raw=true)


# Configuration Options for Control

NOTE: Any of the data columns you define in the properties must also be present on your view.

Primary Field (Required) - Enter the schema name of the field on the view which will be used to generate the title of the Info Box that will be shown when hovering over a pushpin.

Latitude Field (Required) - Enter the Latitude field schema name. For related entities use the following format (new_entityname.new_fieldname)

Longitude Field (Required) - Enter the Latitude field schema name. For related entities use the following format (new_entityname.new_fieldname)

Description Field - Enter the schema name of the field on the view which will displayed in the Info Box that will be shown when hovering over a pushpin.

Pushpin Color Field - Enter the Pushpin Color field schema name if available, this field should contain a hex value for the color. For related entities use the following format (new_entityname.new_fieldname)

Default Pushpin Color - Enter a hex value for the default color of the Pushpins(example: #ffffff).  Otherwise the default Azure Maps color will be used.  Also this default color will be overwritten with specific colors if the Pushpin Color Field is also utilized and that field contains data.

# Useful Links

[Github react-azure-maps](https://github.com/WiredSolutions/react-azure-maps)
[Azure Maps Control Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-use-map-control)
[Azure Map Samples](https://azuremapscodesamples.azurewebsites.net/)
