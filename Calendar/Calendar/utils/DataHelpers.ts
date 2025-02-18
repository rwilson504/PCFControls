import { IInputs } from "../generated/ManifestTypes";
import { Keys } from "../types/Keys";
import { Resource } from "../types/Resource";
import { IEvent } from "../types/IEvent";
import { getNavigationPropertyName } from "./MetadataHelpers";

import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const isHexColor = require("is-hexcolor");

//gets all the fields names and other keys will will need while processing the data
export async function getKeys(
  pcfContext: ComponentFramework.Context<IInputs>
): Promise<Keys> {
  const params = pcfContext.parameters;
  const dataSet = pcfContext.parameters.calendarDataSet;
  
  const resource = params.resourceField.raw
    ? getFieldName(dataSet, params.resourceField.raw)
    : "";
  const resourceGetAllInModel =
    params.resourceGetAllInModel.raw?.toLowerCase() === "true" ? true : false;
  let resourceEtn = "";
  let resourceName = params.resourceName.raw
    ? getFieldName(dataSet, params.resourceName.raw)
    : "";
  let resourceId = "";
  let resourceEntitySetName = "";
  let resourceNavigationProperty = "";

  //if we are in a model app let's get additional info about the resource
  if (
    pcfContext.mode.allocatedHeight === -1 &&
    resource &&
    resourceGetAllInModel
  ) {
    //get the resource entity name
    //@ts-ignore primary entity name
    const primaryEntityName = pcfContext.mode.contextInfo.entityTypeName;
    const eventMeta = await pcfContext.utils.getEntityMetadata(
      primaryEntityName,
      [resource]
    );
    resourceEtn = eventMeta.Attributes.getByName(resource).Targets[0];
    //get the resource primary name and id fields for resource.
    const resourceMeta = await pcfContext.utils.getEntityMetadata(resourceEtn);
    resourceNavigationProperty = await getNavigationPropertyName(
      pcfContext, primaryEntityName, resource);
    resourceEntitySetName = resourceMeta.EntitySetName;
    resourceName = resourceName
      ? resourceName
      : resourceMeta.PrimaryNameAttribute;
    resourceId = resourceMeta.PrimaryIdAttribute;
  }

  return {
    id: params.eventId?.raw ? getFieldName(dataSet, params.eventId.raw) : "",
    name: params.eventFieldName?.raw
      ? getFieldName(dataSet, params.eventFieldName.raw)
      : "",
    start: params.eventFieldStart?.raw
      ? getFieldName(dataSet, params.eventFieldStart.raw)
      : "",
    end: params.eventFieldEnd?.raw
      ? getFieldName(dataSet, params.eventFieldEnd.raw)
      : "",
    eventColor: params.eventColor?.raw
      ? getFieldName(dataSet, params.eventColor.raw)
      : "",
    description: params.eventFieldDescription?.raw
      ? getFieldName(dataSet, params.eventFieldDescription.raw)
      : "",
    resource: resource,
    resourceName: resourceName,
    resourceId: resourceId,
    resourceGetAllInModel: resourceGetAllInModel,
    resourceEtn: resourceEtn,
    resourceNavigationProperty: resourceNavigationProperty,
    resourceEntitySetName: resourceEntitySetName
  };
}

//gets fields name from the datsource columns and provides the necessary alias information for
//related entities.
export function getFieldName(
  dataSet: ComponentFramework.PropertyTypes.DataSet,
  fieldName: string
): string {
  //if the field name does not contain a .  or linking is null which could be the case in a canvas app
  // when using a collection  then just return the field name
  if (fieldName.indexOf(".") === -1 || !dataSet.linking) return fieldName;

  //otherwise we need to determine the alias of the linked entity
  const linkedFieldParts = fieldName.split(".");
  linkedFieldParts[0] =
    dataSet.linking
      .getLinkedEntities()
      .find((e) => e.name === linkedFieldParts[0].toLowerCase())?.alias || "";
  return linkedFieldParts.join(".");
}

//returns all the calendar data including the events and resources
export async function getCalendarData(
  pcfContext: ComponentFramework.Context<IInputs>,
  keys?: Keys
): Promise<{
  resources?: Resource[];
  events: IEvent[];
  keys?: Keys;
}> {
  if (!keys) {
    // If keys is undefined, return empty data
    return { resources: undefined, events: [], keys: undefined };
  }
  const resourceData = await getResources(pcfContext, keys);
  const eventData = await getEvents(pcfContext, resourceData, keys);

  //console.log(`getCalendarData: eventData.length: ${eventData?.length}`);
  return { resources: resourceData, events: eventData, keys: keys };
}

//retrieves all the resources from the datasource
async function getResources(
  pcfContext: ComponentFramework.Context<IInputs>,
  keys: Keys
): Promise<Resource[] | undefined> {
  const dataSet = pcfContext.parameters.calendarDataSet;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resources: any[] = [];
  //if the user did not put in resource then do not add them to the calendar.
  if (!keys.resource) return undefined;

  const totalRecordCount = dataSet.sortedRecordIds.length;

  for (let i = 0; i < totalRecordCount; i++) {
    const recordId = dataSet.sortedRecordIds[i];
    const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

    let resourceId = "";
    let resourceName = "";
    let resourceEtn = "";

    //if this is a Model app we will be using a lookup reference for the Resources
    if (pcfContext.mode.allocatedHeight === -1) {
      const resourceRef = record.getValue(
        keys.resource
      ) as ComponentFramework.EntityReference;
      if (resourceRef) {
        resourceId = resourceRef.id.guid;
        resourceName =
          keys.resourceName && keys.resourceName.indexOf(".") !== -1
            ? (record.getValue(keys.resourceName) as string) || ""
            : resourceRef.name;
        resourceEtn = resourceRef.etn as string;
      }
    }
    //otherwise this is canvas and the user has supplied the data.
    else {
      resourceId = (record.getValue(keys.resource) as string) || "";
      resourceName = keys.resourceName
        ? (record.getValue(keys.resourceName) as string)
        : "";
    }

    if (!resourceId) continue;

    resources.push({ id: resourceId, title: resourceName, etn: resourceEtn });
  }

  if (
    pcfContext.mode.allocatedHeight === -1 &&
    keys.resource &&
    keys.resourceGetAllInModel
  ) {
    await getAllResources(pcfContext, resources, keys);
  }

  const distinctResources = [];
  const map = new Map();
  for (const item of resources) {
    if (!map.has(item.id)) {
      map.set(item.id, true);
      distinctResources.push({
        id: item.id,
        title: item.title || "",
      });
    }
  }

  return distinctResources;
}

export async function getAllResources(
  pcfContext: ComponentFramework.Context<IInputs>,
  resources: Resource[],
  keys: Keys
): Promise<void> {
  if (!keys || !keys.resourceName || !keys.resourceEtn || !keys.resourceId) {
    return;
  }

  const resourceName =
    keys.resourceName.indexOf(".") === -1
      ? keys.resourceName
      : keys.resourceName.split(".")[1];
  const options = keys.resourceName ? `?$select=${resourceName}` : undefined;

  //retrieve all the resources
  const allResources = await pcfContext.webAPI.retrieveMultipleRecords(
    keys.resourceEtn,
    options,
    5000
  );

  //loop through and push them to the resources array
  allResources.entities.forEach((e) => {
    if (keys.resourceId && resourceName in e && keys.resourceId in e) {
      resources.push({
        id: e[keys.resourceId],
        title: e[resourceName],
      });
    }
  });
}

//retrieves all the events from the datasource
export async function getEvents(
  pcfContext: ComponentFramework.Context<IInputs>,
  resources: Resource[] | undefined,
  keys: Keys
): Promise<IEvent[]> {
  const dataSet = pcfContext.parameters.calendarDataSet;
  const totalRecordCount = dataSet.sortedRecordIds.length;

  const newEvents: IEvent[] = [];

  for (let i = 0; i < totalRecordCount; i++) {
    const recordId = dataSet.sortedRecordIds[i];
    const record = dataSet.records[recordId] as DataSetInterfaces.EntityRecord;

    // Ensure key properties are defined and retrieve their values safely
    const name = keys.name
      ? (record.getValue(keys.name) as string | undefined)
      : undefined;
    const start = keys.start ? record.getValue(keys.start) : undefined;
    const end = keys.end ? record.getValue(keys.end) : undefined;

    if (!name || !start || !end) {
      // Skip this record if required fields are missing
      continue;
    }

    const newEvent: IEvent = {
      id: keys.id
        ? (record.getValue(keys.id) as string | undefined) || recordId
        : recordId,
      start: new Date(start as number),
      end: new Date(end as number),
      title: name,
    };

    if (keys.eventColor) {
      const color = record.getValue(keys.eventColor);
      if (color && isHexColor(color)) {
        newEvent.color = color as string;
      }
    }

    if (keys.description) {
      const description = record.getValue(keys.description);
      if (description) {
        newEvent.description = description as string;
      }
    }

    if (resources && keys.resource) {
      const resourceId = record.getValue(keys.resource);
      if (resourceId) {
        newEvent.resource =
          pcfContext.mode.allocatedHeight === -1
            ? (resourceId as ComponentFramework.EntityReference).id.guid
            : (resourceId as string);
      }
    }

    newEvents.push(newEvent);
  }
  console.log(`getEvents: newEvents.length: ${newEvents.length}`);
  return newEvents;
}
