/*
 * @Author: richard.wilson 
 * @Date: 2020-05-09 07:38:02 
 * @Last Modified by:   richard.wilson 
 * @Last Modified time: 2020-05-09 07:38:02 
 */

import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { Calendar, momentLocalizer, Event, Messages } from 'react-big-calendar'
import GetMessages from './Translations'
import * as moment from 'moment'
import * as lcid from 'lcid';
//import * as dates from 'react-big-calendar/lib/utils/dates';

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    onClickSelectedRecord: (recordId: string) => void,
    onClickSlot: (start: Date, end: Date, resourceId: string) => void,
    onRangeChange: (start: Date, end: Date) => void,
    onDateChange: (date: Date, rangeStart: Date, rangeEnd: Date) => void
}

//extend the event interface to include additional properties we wil use.
interface IEvent extends Event{
    id?: string,
    color?: string
}

//Big-Calendar utilizes this for time zone
const localizer = momentLocalizer(moment);

export const CalendarControl: React.FC<IProps> = (props) => {        

const [calendarCulture, setCalendarCulture] = React.useState(getISOLanguage(props.pcfContext))
//set our moment to the current callendar culture for use of it outside the calendar.
moment.locale(calendarCulture);
const [calendarMessages, setCalendarMessages] = React.useState(GetMessages(calendarCulture));
const [calendarRtl, setCalendarRtl] = React.useState(props.pcfContext.userSettings.isRTL);
const [defaultView, setDefaultView] = React.useState(getDefaultView(props.pcfContext.parameters.calendarDefaultView.raw || ""));
const [calendarData, setCalendarData] = React.useState<{resources: any[] | undefined, events: IEvent[], keys: any}>({resources: [], events: [], keys: undefined});
const [calendarDate, setCalendarDate] = React.useState(props.pcfContext.parameters.calendarDate?.raw?.getTime() === 0 ? moment().toDate() : props.pcfContext.parameters.calendarDate.raw || moment().toDate());
const [calendarScrollTo, setCalendarScrollTo] = React.useState(moment().set({"hour": props.pcfContext.parameters.calendarScrollToTime?.raw || 0, "minute": 0, "seconds" : 0}).toDate());
const calendarRef = React.useRef(null);

//sets the keys and calendar data when the control is loaded or the calendarDataSet changes.
React.useEffect(()=>{
    async function asyncCalendarData(){
        var keys = calendarData.keys;
        if (!keys)
        {
            keys = await getKeys(props.pcfContext);
        }

        var dataSet = props.pcfContext.parameters.calendarDataSet;
        if (dataSet.loading === false)
        {
            setCalendarData(await getCalendarData(props.pcfContext, keys));
        }
    }        
    asyncCalendarData();
},
[props.pcfContext.parameters.calendarDataSet]);

//allows for changing the calendar date if a date/time field is utilized in canvas on the input parameters
React.useEffect(()=>{
    if (props.pcfContext.parameters.calendarDate?.raw?.getTime() !== 0 && calendarDate != props.pcfContext.parameters.calendarDate.raw){
        setCalendarDate(props.pcfContext.parameters.calendarDate.raw as Date)
    }    
},[props.pcfContext.parameters.calendarDate.raw])

React.useEffect(()=>{
    if (calendarDate)
    {    
        let ref = calendarRef.current as any;
        let rangeDates = getCurrentRange(calendarDate, ref.props.view, ref.props.culture)        
        props.onDateChange(calendarDate, rangeDates.start, rangeDates.end);
    }
},[calendarDate])

//when an event is selected it return the events id in canvas and open the record in model app
const _handleEventSelected = (event: IEvent) => {
    let eventId = event.id as string
    
    //props.pcfContext.parameters.calendarDataSet.setSelectedRecordIds([eventId]);
    props.onClickSelectedRecord(event.id as string);

    //if we are in a model app open the record when it's selected.
    if (props.pcfContext.mode.allocatedHeight === -1){
        props.pcfContext.navigation.openForm({
            entityId: eventId, 
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: false
        });
    }
}

//when an empty area on the calendar is selected this output the values for the selected range in canvas
//and opens the record in model.
const _handleSlotSelect = (slotInfo: any) => {
   
    props.onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");
    //if we are in a model app open a new record and pass in the data
    if (props.pcfContext.mode.allocatedHeight === -1){

        let newRecordProperties: any = {};
        newRecordProperties[calendarData.keys.start] = formatDateAsParameterString(slotInfo.start);
        newRecordProperties[calendarData.keys.end] = formatDateAsParameterString(slotInfo.end);
        if (calendarData.keys.resource && slotInfo.resourceId && calendarData.resources){
            var resourceInfo = calendarData.resources.find(x=> x.id === slotInfo.resourceId);
            newRecordProperties[calendarData.keys.resource] = resourceInfo.id;
            newRecordProperties[calendarData.keys.resource + "name"] = resourceInfo.title;
            newRecordProperties[calendarData.keys.resource + "type"] = resourceInfo.etn;
        }    
        props.pcfContext.navigation.openForm({            
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: false,            
        }, newRecordProperties);
    }
}

//required event when using a variable for the Calendar Date
const _handleNavigate = (date: Date, view: string, action: string) => {
    //console.log("_handleNavigate");
    setCalendarDate(moment(date).toDate());
}

//sends the new range values to the output parameters when the range is updated
const _handleRangeChange = (rangeInfo: any) => {
    //on some view the rangeInfo has a start and end date
    if (rangeInfo.hasOwnProperty('start') && rangeInfo.hasOwnProperty('end'))
    {    
        props.onRangeChange(rangeInfo.start, rangeInfo.end);
    }
    //on other views it has an array of dates
    if (Array.isArray(rangeInfo)) {
        props.onRangeChange(rangeInfo[0], rangeInfo[rangeInfo.length-1]);
    }
}

return(!calendarData?.resources ? <Calendar
    selectable
    localizer={localizer}
    date={calendarDate}
    culture={calendarCulture}
    rtl={calendarRtl}
    messages={calendarMessages}
    defaultView={defaultView}
    scrollToTime={calendarScrollTo} 
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected} 
    onSelectSlot={ _handleSlotSelect }
    onRangeChange={ _handleRangeChange }
    onNavigate={ _handleNavigate }
    ref={calendarRef}
    eventPropGetter={event => ({            
        style: {
            backgroundColor: event.color || "#3174ad",
            color: getContrastYIQ(event.color || "#3174ad")
        }
    })}
    /> : 
    <Calendar
    selectable
    localizer={localizer}
    date={calendarDate}
    culture={calendarCulture}
    messages={calendarMessages}
    defaultView={defaultView}
    scrollToTime={calendarScrollTo} 
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected }
    onSelectSlot={ _handleSlotSelect }
    onRangeChange={ _handleRangeChange }
    onNavigate={ _handleNavigate }
    resources={calendarData.resources}
    resourceAccessor="resource"
    ref={calendarRef}
    eventPropGetter={event => ({            
        style: {
            backgroundColor: event.color || "#3174ad",
            color: getContrastYIQ(event.color || "#3174ad")
        }
    })}
    />);
}

//gets all the fields names and other keys will will need while processing the data
async function getKeys(pcfContext: ComponentFramework.Context<IInputs>) : Promise<any> {
    let params = pcfContext.parameters;
    let dataSet = pcfContext.parameters.calendarDataSet;

    let resource = params.resourceField.raw ? getFieldName(dataSet, params.resourceField.raw) : "";
    let resourceGetAllInModel = params.resourceGetAllInModel.raw?.toLowerCase() === "true" ? true : false;
    let resourceEtn = '';
    let resourceName = params.resourceName.raw ? getFieldName(dataSet, params.resourceName.raw) : "";
    let resourceId = '';

    //if we are in a model app let's get additional info about the resource
    if (pcfContext.mode.allocatedHeight === -1 && resource && resourceGetAllInModel)
    {
        //get the resource entity name
        ///@ts-ignore
        let eventMeta = await pcfContext.utils.getEntityMetadata(pcfContext.mode.contextInfo.entityTypeName, [resource]);
        resourceEtn = eventMeta.Attributes.getByName(resource).Targets[0];        
        //get the resource primary name and id fields for resource.
        let resourceMeta = await pcfContext.utils.getEntityMetadata(resourceEtn);
        resourceName = resourceName ? resourceName : resourceMeta.PrimaryNameAttribute;
        resourceId = resourceMeta.PrimaryIdAttribute;        
    }

    return {
        id: params.eventId.raw ? getFieldName(dataSet,params.eventId.raw) : "", 
        name: params.eventFieldName.raw ? getFieldName(dataSet, params.eventFieldName.raw) : "",
        start: params.eventFieldStart.raw ? getFieldName(dataSet, params.eventFieldStart.raw) : "",
        end: params.eventFieldEnd.raw ? getFieldName(dataSet, params.eventFieldEnd.raw) : "",
        eventColor: params.eventColor.raw ? getFieldName(dataSet, params.eventColor.raw) : "",
        resource: resource,
        resourceName: resourceName,
        resourceId: resourceId,
        resourceGetAllInModel: resourceGetAllInModel,
        resourceEtn: resourceEtn
    }
}

//gets fields name from the datsource columns and provides the necessary alias information for
//related entities.
function getFieldName(dataSet: ComponentFramework.PropertyTypes.DataSet , fieldName: string): string {
    //if the field name does not contain a . then just return the field name
    if (fieldName.indexOf('.') === -1) return fieldName;

    //otherwise we need to determine the alias of the linked entity
    var linkedFieldParts = fieldName.split('.');
    linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
    return linkedFieldParts.join('.');
}

//returns all the calendar data including the events and resources
async function getCalendarData(pcfContext: ComponentFramework.Context<IInputs>, keys: any) : Promise<{resources: any[] | undefined, events: Event[], keys: any}>
{
    let resourceData = await getResources(pcfContext, keys);
    let eventData = await getEvents(pcfContext, resourceData, keys);

    return {resources: resourceData, events: eventData, keys: keys}
}

//retrieves all the resources from the datasource
async function getResources(pcfContext: ComponentFramework.Context<IInputs>, keys: any): Promise<any[] | undefined> {
    let dataSet = pcfContext.parameters.calendarDataSet;
    
    let resources: any[] = [];
    //if the user did not put in resource then do not add them to the calendar.
    if (!keys.resource) return undefined;
    
    let totalRecordCount = dataSet.sortedRecordIds.length;
    
    for (let i = 0; i < totalRecordCount; i++) {
        let recordId = dataSet.sortedRecordIds[i];
        let record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

        let resourceId = "";
        let resourceName = "";
        let resourceEtn = "";

        //if this is a Model app we will be using a lookup reference for the Resources
        if (pcfContext.mode.allocatedHeight === -1){
            let resourceRef = record.getValue(keys.resource) as ComponentFramework.EntityReference;
            if (resourceRef){
                resourceId = resourceRef.id.guid;
                resourceName = keys.resourceName && keys.resourceName.indexOf('.') !== -1 ? record.getValue(keys.resourceName) as string || "" : resourceRef.name;
                resourceEtn = resourceRef.etn as string;
            }
        }
        //otherwise this is canvas and the user has supplied the data.
        else
        {
            resourceId = record.getValue(keys.resource) as string;
            resourceName = record.getValue(keys.resourceName) as string;
        }
        
        if (!resourceId) continue;

        resources.push({id: resourceId, title: resourceName, etn: resourceEtn});
    }

    if (pcfContext.mode.allocatedHeight === -1 && keys.resource && keys.resourceGetAllInModel){
        await getAllResources(pcfContext, resources, keys);
    }

    const distinctResources = [];
    const map = new Map();
    for (const item of resources) {
        if (!map.has(item.id)){
            map.set(item.id, true);
            distinctResources.push({
                id: item.id,
                title: item.title || ''
            });
        }
    }

    return distinctResources;    
}

//retrieves all the events from the datasource
async function getEvents(pcfContext: ComponentFramework.Context<IInputs>, resources: any[] | undefined, keys: any): Promise<Event[]> {
        let dataSet = pcfContext.parameters.calendarDataSet;
        let totalRecordCount = dataSet.sortedRecordIds.length;

        let newEvents: Event[] = [];
        for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
            var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
        
            var name = record.getValue(keys.name) as string;
			var start = record.getValue(keys.start);
            var end = record.getValue(keys.end);                        

            if (!name || !start || !end) continue;

            let newEvent: IEvent = {
                id: keys.id ? record.getValue(keys.id) as string || recordId : recordId,
                start: new Date(start as number),
                end: new Date(end as number),
                title: name
            };

            let color = record.getValue(keys.eventColor);
            if (color) newEvent.color = color as string;

            if (resources)
            {
                var resourceId = record.getValue(keys.resource);
                if (resourceId){
                    //if model app get the id of the entity reference, otherwise use the id field provided
                    newEvent.resource = pcfContext.mode.allocatedHeight === -1 ? 
                        (resourceId as ComponentFramework.EntityReference).id.guid : resourceId;
                }
            }

            newEvents.push(newEvent);
        }

        return newEvents;
}

//determines if the title text will be black or white depending on the color of the background
function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

//format the date/time so that it can be passed as a parameter to a Dynamics form
function formatDateAsParameterString(date: Date){
    //months are zero index so don't forget to add one :)
    return (date.getMonth() + 1) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
}

function getDefaultView(viewName: string) : "month" | "week" | "work_week" | "day" | "agenda" | undefined {
    let possibleViews = ["month", "week", "work_week", "day", "agenda"];
    return possibleViews.indexOf(viewName) > -1 ? possibleViews[possibleViews.indexOf(viewName)] as any: undefined;
}

async function getAllResources(pcfContext: ComponentFramework.Context<IInputs>, resources: any[], keys: any): Promise<void> {
    var resourceName = keys.resourceName.indexOf('.') === -1 ? keys.resourceName : keys.resourceName.split('.')[1];
    var options = keys.resourceName ? `?$select=${resourceName}` : undefined;
    
    //retrieve all the resources
    var allResources = await pcfContext.webAPI.retrieveMultipleRecords(keys.resourceEtn, options, 5000);
    
    //loop through and push them to the resources array
    allResources.entities.forEach(e => { 
        resources.push({
            id: e[keys.resourceId],
            title: e[resourceName]
        })
    });
}

function getISOLanguage(pcfContext: ComponentFramework.Context<IInputs>): string
{
    //look for a lanuage setting comging in from the parameters.
    //if nothign was entered use an empty string which will default to en
    let lang = pcfContext.parameters.calendarLanguage?.raw || '';    

    //if this is a model app and a language was not added as an input then user the current users
    // language settings.
    if (!lang && pcfContext.mode.allocatedHeight === -1){
        lang = lcid.from(pcfContext.userSettings.languageId);
        return lang.substring(0, lang.indexOf('_'));
    }

    return lang;
}

function getCurrentRange(date: Date, view: string, culture: string) : {start: Date, end: Date} {

    let start = moment().toDate(), end = moment().toDate();
    if(view === 'day'){
      start = moment(date).startOf('day').toDate();
      end   = moment(date).endOf('day').toDate();
    }
    else if(view === 'week'){
      start = moment(date).startOf('week').toDate();
      end   = moment(date).endOf('week').toDate();
    }
    else if(view === 'month'){
    start = moment(date).startOf('month').startOf('week').toDate()
    end = moment(date).endOf('month').endOf('week').toDate()
    }
    else if(view === 'agenda'){
      start = moment(date).startOf('day').toDate();
      end   = moment(date).endOf('day').add(1, 'month').toDate();
    }
    return {start, end};
  }