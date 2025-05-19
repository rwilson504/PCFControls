import { IInputs } from "../generated/ManifestTypes";
import { Resource, Event } from "../types/schedulerTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import dayjs from "dayjs";

// Gets all the field names and other keys needed while processing the data
export async function getKeys(pcfContext: ComponentFramework.Context<IInputs>): Promise<any> {
    const params = pcfContext.parameters;
    const dataSet = pcfContext.parameters.schedulerDataSet;

    const resource = params.resourceField.raw ? getFieldName(dataSet, params.resourceField.raw) : "";
    const resourceParent = params.resourceParentField.raw ? getFieldName(dataSet, params.resourceParentField.raw) : "";
    const resourceGetAllInModel = params.resourceGetAllInModel.raw?.toLowerCase() === "true" ? true : false;
    let resourceEtn = '';
    let resourceName = params.resourceName.raw ? getFieldName(dataSet, params.resourceName.raw) : "";
    let resourceId = '';
    const colorFieldInfo = params.eventColor.raw ? getColorFieldInfo(pcfContext, params.eventColor.raw) : undefined;

    // If we are in a model app, get additional info about the resource
    if (pcfContext.mode.allocatedHeight === -1) {
        let eventMetaFields = [resource];
        if (colorFieldInfo?.etn) {
            eventMetaFields.push(colorFieldInfo.field);
        }
        const eventMeta = await pcfContext.utils.getEntityMetadata(dataSet.getTargetEntityType(), eventMetaFields);
        resourceEtn = eventMeta.Attributes.getByName(resource).Targets[0];

        const resourceMetaFields = colorFieldInfo?.etn === resourceEtn ? [colorFieldInfo.field] : [];
        const resourceMeta = await pcfContext.utils.getEntityMetadata(resourceEtn, resourceMetaFields);
        resourceName = resourceName ? resourceName : resourceMeta.PrimaryNameAttribute;
        resourceId = resourceMeta.PrimaryIdAttribute;
    }

    return {
        id: params.eventId.raw ? getFieldName(dataSet, params.eventId.raw) : "",
        name: params.eventFieldName.raw ? getFieldName(dataSet, params.eventFieldName.raw) : "",
        start: params.eventFieldStart.raw ? getFieldName(dataSet, params.eventFieldStart.raw) : "",
        end: params.eventFieldEnd.raw ? getFieldName(dataSet, params.eventFieldEnd.raw) : "",
        eventColor: params.eventColor.raw ? getFieldName(dataSet, params.eventColor.raw) : "",
        resource: resource,
        resourceName: resourceName,
        resourceId: resourceId,
        resourceGetAllInModel: resourceGetAllInModel,
        resourceEtn: resourceEtn
    };
}

// Gets field name from the datasource columns and provides the necessary alias information for related entities
export function getFieldName(dataSet: ComponentFramework.PropertyTypes.DataSet, fieldName: string): string {
    if (fieldName.indexOf('.') === -1) return fieldName;
    const linkedFieldParts = fieldName.split('.');
    linkedFieldParts[0] = dataSet.linking.getLinkedEntities().find(e => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
    return linkedFieldParts.join('.');
}

// Gets color field info for related entities
export function getColorFieldInfo(
    pcfContext: ComponentFramework.Context<IInputs>,
    fieldName: string
): { etn: string, field: string } {
    // If the field name does not contain a '.', just return the field name
    // @ts-ignore
    if (fieldName.indexOf('.') === -1) return { etn: pcfContext.mode.contextInfo.entityTypeName, field: fieldName };
    const linkedFieldParts = fieldName.split('.');
    return { etn: linkedFieldParts[0], field: linkedFieldParts[1] };
}

// Returns all the scheduler data including the events and resources
export async function getSchedulerData(
    pcfContext: ComponentFramework.Context<IInputs>,
    keys: any
): Promise<{ resources: Resource[], events: Event[], keys: any }> {
    const resourceData = await getResources(pcfContext, keys);
    const eventData = await getEvents(pcfContext, resourceData, keys);
    return { resources: resourceData, events: eventData, keys: keys };
}

// Retrieves all the resources from the datasource
export async function getResources(
    pcfContext: ComponentFramework.Context<IInputs>,
    keys: any
): Promise<Resource[]> {
    const dataSet = pcfContext.parameters.schedulerDataSet;
    const resources: Resource[] = [];
    if (!keys.resource) return resources;

    const totalRecordCount = dataSet.sortedRecordIds.length;

    for (let i = 0; i < totalRecordCount; i++) {
        const recordId = dataSet.sortedRecordIds[i];
        const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

        let resourceId = "";
        let resourceName = "";
        let resourceEtn = "";

        if (pcfContext.mode.allocatedHeight === -1) {
            const resourceRef = record.getValue(keys.resource) as ComponentFramework.EntityReference;
            if (resourceRef) {
                resourceId = resourceRef.id.guid;
                resourceName = pcfContext.parameters.resourceName.raw || keys.resourceGetAllInModel
                    ? (record.getValue(keys.resourceName) as string) || "" : resourceRef.name;
                resourceEtn = resourceRef.etn as string;
            }
        } else {
            resourceId = record.getValue(keys.resource) as string;
            resourceName = record.getValue(keys.resourceName) as string;
        }

        if (!resourceId) continue;
        resources.push({ id: resourceId, name: resourceName, etn: resourceEtn });
    }

    if (pcfContext.mode.allocatedHeight === -1 && keys.resource && keys.resourceGetAllInModel) {
        await getAllResources(pcfContext, resources, keys);
    }

    const distinctResources: Resource[] = [];
    const map = new Map();
    for (const item of resources) {
        if (!map.has(item.id)) {
            map.set(item.id, true);
            distinctResources.push({
                id: item.id,
                name: item.name || '',
                etn: item.etn
            });
        }
    }

    return distinctResources;
}

// Retrieves all the events from the datasource
export async function getEvents(
    pcfContext: ComponentFramework.Context<IInputs>,
    resources: Resource[] | undefined,
    keys: any
): Promise<Event[]> {
    const dataSet = pcfContext.parameters.schedulerDataSet;
    const totalRecordCount = dataSet.sortedRecordIds.length;

    const newEvents: Event[] = [];
    for (let i = 0; i < totalRecordCount; i++) {
        const recordId = dataSet.sortedRecordIds[i];
        const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

        const name = record.getValue(keys.name) as string;
        const start = record.getValue(keys.start);
        const end = record.getValue(keys.end);
        const resourceId = record.getValue(keys.resource);

        if (!name || !start || !end || !resourceId) continue;

        const etn = (pcfContext.mode.allocatedHeight === -1 && resourceId && typeof resourceId === "object" && "etn" in resourceId)
            ? (resourceId as ComponentFramework.EntityReference).etn
            : "";

        const newEvent: Event = {
            id: i,
            eventId: keys.id ? (record.getValue(keys.id) as string) || recordId : recordId,
            resourceId: pcfContext.mode.allocatedHeight === -1
                ? (resourceId as ComponentFramework.EntityReference).id.guid
                : (resourceId as string),
            etn: "",
            start: dayjs(start as number).format('YYYY-MM-DD HH:mm:ss'),
            end: dayjs(end as number).format('YYYY-MM-DD HH:mm:ss'),
            title: name
        };

        // let color = record.getValue(keys.eventColor);
        // if (color) newEvent.bgColor = color as string;

        newEvents.push(newEvent);
    }

    return newEvents;
}

// Retrieves all resources for model-driven apps if needed
export async function getAllResources(
    pcfContext: ComponentFramework.Context<IInputs>,
    resources: Resource[],
    keys: any
): Promise<void> {
    if (!keys || !keys.resourceName || !keys.resourceEtn || !keys.resourceId) {
        return;
    }

    const resourceName =
        keys.resourceName.indexOf(".") === -1
            ? keys.resourceName
            : keys.resourceName.split(".")[1];
    const options = keys.resourceName ? `?$select=${resourceName}` : undefined;

    const allResources = await pcfContext.webAPI.retrieveMultipleRecords(
        keys.resourceEtn,
        options,
        5000
    );

    allResources.entities.forEach((e: any) => {
        if (keys.resourceId && resourceName in e && keys.resourceId in e) {
            resources.push({
                id: e[keys.resourceId],
                name: e[resourceName],
                etn: keys.resourceEtn
            });
        }
    });
}