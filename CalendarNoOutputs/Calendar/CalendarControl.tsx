import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import * as moment from 'moment'
import { prependOnceListener } from 'cluster';

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    onClickSelectedRecord: (recordId: string) => void,
    onClickSlot: (start: Date, end: Date, resourceId: string) => void
}

const localizer = momentLocalizer(moment);

export const CalendarControl: React.FC<IProps> = (props) => {        
    
    const [keys, setKeys] = React.useState(getKeys(props.pcfContext));
    const [calendarData, setCalendarData] = React.useState(getCalendarData(props.pcfContext, keys));	

React.useEffect(()=>{
    var dataSet = props.pcfContext.parameters.calendarDataSet;
    if (dataSet.loading === false)
	{
        setCalendarData(getCalendarData(props.pcfContext, keys));
    }
},
[props.pcfContext.parameters.calendarDataSet])

const _handleEventSelected = (event: Event) => {
    let eventId = event.id as string
    
    //props.pcfContext.parameters.calendarDataSet.setSelectedRecordIds([eventId]);
    props.onClickSelectedRecord(event.id as string);

    //if we are in a model app open the record when it's selected.
    if (props.pcfContext.mode.allocatedHeight === -1){
        props.pcfContext.navigation.openForm({
            entityId: eventId, 
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: true
        });
    }
}

const _handleSlotSelect = (slotInfo: any) => {
   
    props.onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");
    //if we are in a model app open a new record and pass in the data
    if (props.pcfContext.mode.allocatedHeight === -1){

        let newRecordProperties: any = {};
        newRecordProperties[keys.start] = formatDateAsParameterString(slotInfo.start);
        newRecordProperties[keys.end] = formatDateAsParameterString(slotInfo.end);
        if (keys.resource && slotInfo.resourceId && calendarData.resources){
            var resourceInfo = calendarData.resources.find(x=> x.id === slotInfo.resourceId);
            newRecordProperties[keys.resource] = resourceInfo.id;
            newRecordProperties[keys.resource + "name"] = resourceInfo.title;
            newRecordProperties[keys.resource + "type"] = resourceInfo.etn;
        }    
        props.pcfContext.navigation.openForm({            
            entityName: props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
            openInNewWindow: true,            
        }, newRecordProperties);
    }
}

return(!calendarData?.resources ? <Calendar
    selectable
    localizer={localizer}
    defaultDate={new Date()}
    //defaultView={props.pcfContext.parameters.defaultCalendarView.raw}//"month"
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected} 
    onSelectSlot={ _handleSlotSelect }
    /> : 
    <Calendar
    selectable
    localizer={localizer}
    defaultDate={new Date()}
    //defaultView={props.pcfContext.parameters.defaultCalendarView.raw}//"month"
    events={calendarData.events}
    onSelectEvent={ _handleEventSelected }
    onSelectSlot={ _handleSlotSelect }
    resources={calendarData.resources}
    resourceAccessor="resource"
    eventPropGetter={event => ({            
        style: {
            backgroundColor: event.color || "#3174ad",
            color: getContrastYIQ(event.color || "#3174ad")
        }
    })}
    />);
}

function getKeys(pcfContext: ComponentFramework.Context<IInputs>) {
    let params = pcfContext.parameters;
    let dataSet = pcfContext.parameters.calendarDataSet;
    return { 
        name: params.eventFieldName.raw ? getFieldName(dataSet, params.eventFieldName.raw) : "",
        start: params.eventFieldStart.raw ? getFieldName(dataSet, params.eventFieldStart.raw) : "",
        end: params.eventFieldEnd.raw ? getFieldName(dataSet, params.eventFieldEnd.raw) : "",
        eventColor: params.eventColor.raw ? getFieldName(dataSet, params.eventColor.raw) : "",
        resource: params.resourceField.raw ? getFieldName(dataSet, params.resourceField.raw) : "",
        resourceName: params.resourceName.raw ? getFieldName(dataSet, params.resourceName.raw) : ""        
    }
}

function getFieldName(dataSet: ComponentFramework.PropertyTypes.DataSet ,fieldName: string): string {
    //if the field name does not contain a . then just return the field name
    if (fieldName.indexOf('.') == -1) return fieldName;

    //otherwise we need to determine the alias of the linked entity
    var linkedFieldParts = fieldName.split('.');
    linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
    return linkedFieldParts.join('.');
}

function getCalendarData(pcfContext: ComponentFramework.Context<IInputs>, keys: any)
{
    let dataSet = pcfContext.parameters.calendarDataSet;
    let resourceData = getResources(pcfContext, keys);
    let eventData = getEvents(dataSet, resourceData, keys);

    return {resources: resourceData, events: eventData}
}

function getResources(pcfContext: ComponentFramework.Context<IInputs>, keys: any): any[] | undefined {
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
                resourceName = keys.resourceName ? record.getValue(keys.resourceName) as string || "" : resourceRef.name;
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

function getEvents(dataSet: ComponentFramework.PropertyTypes.DataSet, resources: any[] | undefined, keys: any): Event[] {

        let totalRecordCount = dataSet.sortedRecordIds.length;

        let newEvents: Event[] = [];
        for (let i = 0; i < totalRecordCount; i++) {
			var recordId = dataSet.sortedRecordIds[i];
            var record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;
        
            var name = record.getValue(keys.name) as string;
			var start = record.getValue(keys.start);
            var end = record.getValue(keys.end);                        

            if (!name || !start || !end) continue;

            let newEvent: Event = {
                id: recordId,
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
                    newEvent.resource = resourceId;
                    //newEvent.resourceId = resourceId as string;
                }
            }

            newEvents.push(newEvent);
        }

        return newEvents;
}

function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function formatDateAsParameterString(date: Date){
    return (date.getMonth() + 1) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
}