This calendar control was built off of [React Big Calendar](https://github.com/jquense/react-big-calendar).  The calendar can be used to display events with or without related resources.

This control has been designed to work in both Canvas and Model apps.  Because of the differences in those types of applications there are some differences in how you utilize them in each app.

![Control Overview](./images/calendarcontrol.gif)

Canvas
- If you want to utilize resources in Canvas you will need to use a collection as the data source. If just showing events with no resources a simple CDS dataset can be used.
- There are output parameters that are defined in the app which will pass back data when an item is clicked on, an empty time span is selected, or the calendar range has been updated.  These output parameters will allow you to create your own functionality in the Canvas app for updated or creating records.

Model
- Clicking on and event will open the record for editing.
- Clicking on an empty timespan will open a new record form, and will pass in the start, end, and resource field data.


# Model Configuration
To add the calendar in a model view you can do the following.

Create a new view or select an existing one.  You need to make sure that any columns you utilize in the control properties are in the view.
![Add Columns To View](./images/ModelCalendarAddColumns.png)

Click to add the custom control
![Add Custom Control](./images/ModelCalendarAddControl.png)

Select the Calendar Control
![Select Calendar Control](./images/ModelCalendarSelectCalendarControl.png)

Choose the places you want the control to show up such as web or tablet.  Then begin to modify the properties of the control.
![Select Control Locations and Properties](./images/ModelCalendarSelectProperties.png)

After you are done save the view and do a Publish All.

If at first you dont see the control on the view you created do the following.

Select the elipses and do Show As
![Select Show As](./images/ModelCalendarShowAs.png)

Select the Calendar Control
![Select Calendar Control](./images/ModelCalendarShowAs.png)

Set the propertie of the control.
- **Event Name Field** This will be the title for the events.  Enter the logical name of the attribute in this fields. Ex. raw_name
- **Event Start Field** This will be the start time for the events.  Enter the logical name of the attribute in this fields. Ex. raw_start
- **Event End Field** This will be the end time for the events.  Enter the logical name of the attribute in this fields. Ex. raw_end
- **Event Color Field** This will change the color of the event.  You can use a color field on the event or you can utlize a color field from the resources. Enter the logical name of the attribute.  Ex. on Event raw_color, Ex. on Resource raw_resource.raw_color.
- **Event Id Field** (Do Not Use In Model, for Canvas Only were data is supplied by a collection)
- **Resource Field** If you want to utilize resources enter the logical name of the lookup field for the Resource.
- **Resource Name** To use a name field for the resource that is not the default name field you can enter it here. Ex. raw_resource.raw_specialname.  Otherwise you can leave this blank and it will use data from the default name field.
- **Get All Resources** Determines if all resources will be returned even those that don't have any events on the calendar.  Possible values are true or false.
- **Default Claendar View** Set the default calendar view.  Possible values are "month", "week", "work_week", "day", "agenda"
- **Calendar Date** (Do Not Use In Model, for Canvas Only)

# Canvas Configuration
Using the control in Canvas requires more configuration due to the limitations and differences inherit between Model and Canvas apps.  In a canvas app the actions such as creating a new record or updating an existing one need to be implemented by the person creating the app.  The control will provide you with output which will allow you to access data from the calendar and complete those interactions.

*Important Notes:*

- Using Code Components in a canvas app is currently in pre-release.  You will need to follow [these directions](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps) in order to enable this feature within your environment.
- After you drop the calendar control onto your Canvas app or update any of the controls properties make sure that you close and re-open the app in the PowerApps Editor to see the changes reflected.
- When adding the control to the form it will have a long name like raw_RAW.Calendar.Calendar(00000001-0000-0000-0001-00000000009b1) rename it to something simple like Calendar Control

## Events Only
To just get the events and display them on the calendar we can utilize the CDS data source for the events table.

Here is the data source selection on the control.
![Data Source Selection](./images/CanvasCalendarEventsOnlyDataSource.png)

Here are the input properties for the control
![Input Properties](./images/CanvasCalendarEventsOnlyAdvancedProps.png)

## Events and Resources
In order to get the Events from one CDS entity and the Resources from another Entity/Lookup we will need put our CDS data into a Collection and attach our control to that Collection for it's data. Also because we will be utilizing a control you will need to add in the EventId and set that parameter on the control. 

### Return Only Resources That Have Events
The configuration below will load the Events and include information about their resources. Also because we will be utilizing a control you will need to add in the EventId and set that parameter on the control. 

Here you can see that there are 5 resources in our Resource data.
![Events With Resources Data Source](./images/CanvasCalendarResourcesWithEventsData.png)

In the resource Day view of the calendar though it only shows 4 resources because Andrew doesn't have any events.
![Events With Resources Header](./images/CanvasCalendarResourcesWithEventsResourceHeader.png)

The following code can be added to the OnVisible event of the Canvas form.

```
//Since the Resources are from a related entity it is best to create a 
// collection and create our own columns to make sure we don't end up with 
// some Canvas issues such as related data not showing up in the dataset.
ClearCollect(
    finalEvents,
    AddColumns(
        Events,
        "ResourceColor",
        Resource.Color,
        "ResourceName",
        Resource.Name,
        "ResourceId",
        Resource.Resource,
        "EventStart",
        Start,
        "EventEnd",
        End,
        "EventName",
        Name,
        "EventId",
        Events
    )
);
```

Here is the data source selection on the control.
![Data Source Selection](./images/CanvasCalendarResourcesWithEventsDataSource.png)

Here are the input properties for the control
![Input Properties](./images/CanvasCalendarResourcesWithEventsAdvancedProps.png)


### Return All Resources and Events
To return all resources including those who don't have any events for the current time period you will need to perform some additional work on the Collection. 

![All Resources in Model App](./images/CanvasCalendarAllResourcesResourceHeader.png)

The following code can be added to the OnVisible event of the Canvas form.

```
//Clear and create a collection which will hold our events.  We need to 
// add and map data to additional columns so we can join all the data 
// together in the end and it get's us around a lot of the issues we run into 
// with Canvas app such as Lookup data not being included in the dataset.
ClearCollect(
    finalEvents,
    AddColumns(
        Events,
        "ResourceColor",
        Resource.Color,
        "ResourceName",
        Resource.Name,
        "ResourceId",
        Resource.Resource,
        "EventStart",
        Start,
        "EventEnd",
        End,
        "EventName",
        Name,
        "EventId",
        Events
    )
);
//Create the resource collection.  This collection will include all 
// resources in the system so that we will get resources on the calendar 
// that do not have events.
ClearCollect(
    finalResources,
    AddColumns(
        Resources,
        "ResourceColor",
        Color,
        "ResourceName",
        Name,
        "ResourceId",
        Resource
    )
);
//Create a new merged collection containing the events
ClearCollect(mergedSources, finalEvents);
//Now add the Resources to the collection.
Collect(mergedSources, finalResources);
```

Here is the data source selection on the control.
![Data Source Selection](./images/CanvasCalendarAllResourcesDataSource.png)

Here are the input properties for the control
![Input Properties](./images/CanvasCalendarAllResourcesAdvancedProps.png)

## OnChange Event
The data returned from the control will be attached to the Canvas Control element.  There are currently 3 defined types of output changes that occur.

* RecordSelection, occurs whenever a user clicks on a calendar event.
    * .onChangeAction, "RecordSelection"
    * .selectedRecordId, The id of the record selected.
* TimSlotSelected, occurs when a user select an empty area on the calendar.  It will return the timespan for the selection.
    * .onChangeAction, "TimSlotSelected"
    * .selectedSlotStart, The start time of the empty slot selected. 
    * .selectedSlotEnd, The end time of the empty slot selected. 
    * .selectedSlotResourceId, If the time slot was on a view showing the resources the Id of that Resoruce will be provided.
* RangeChange, when a user click on an empty part of the calendar
    * .onChangeAction, "RangeChange"
    * .currentRangeStart, The current start time show on the calendar view.
    * .currentRangeStart, The current end time show on the calendar view.
* DateChange, when the current date of the calendar changes
    * .onChangeAction, "DateChange"
    * .currentCalendarDate, The current date of the calendar control

This is an example of a text box with the Default values set the .selectedRecordId property of the control.
![Text Box Showing Selected ID](./images/CanvasCalendarOnChangeProperties.png)

This is an example of the OnChange event on the Calendar Control which will allow you to do things such as open a form to create a new record or update and existing one.

![Calendar OnChange Event](./images/CanvasCalendarOnChange.png)
