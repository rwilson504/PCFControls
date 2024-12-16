/*
 * @Author: richard.wilson
 * @Date: 2020-05-09 07:38:02
 * @Last Modified by: Rick Wilson
 * @Last Modified time: 2024-12-16 11:18:49
 */
import cssVars from "css-vars-ponyfill";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./css/react-big-calendar.override.css";
import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import {
  Calendar,
  momentLocalizer,
  Event,
  View,
  ViewsProps,
  DateLocalizer,
} from "react-big-calendar";
import { StartOfWeek } from "date-arithmetic";
import { Resource } from "./types/Resource";
import { Keys } from "./types/Keys";
import GetMessages from "./components/Translations";
import * as moment from "moment";
import * as lcid from "lcid";
import * as Color from "color";

import CustomWorkWeek from "./components/WorkWeek";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const isHexColor = require("is-hexcolor");

export interface IProps {
  pcfContext: ComponentFramework.Context<IInputs>;
  onClickSelectedRecord: (recordId: string) => void;
  onClickSlot: (start: Date, end: Date, resourceId: string) => void;
  onCalendarChange: (
    date: Date,
    rangeStart: Date,
    rangeEnd: Date,
    view: View
  ) => void;
}

//extend the event interface to include additional properties we wil use.
interface IEvent extends Event {
  id?: string;
  color?: string;
}

const allViews = ["month", "week", "work_week", "day", "agenda"] as string[];

export const CalendarControl: React.FC<IProps> = (props) => {
  //set our moment to the current calendar culture for use of it outside the calendar.
  const localizer = momentLocalizer(moment);
  //customize the momentLocalizer to utilize our week start day property.
  localizer.startOfWeek = (culture: string): StartOfWeek => {
    let weekStart: StartOfWeek;

    if (weekStartDay && weekStartDay > 0) {
      weekStart = (weekStartDay - 1) as StartOfWeek; // Adjusting day and casting to StartOfWeek
    } else {
      const data = culture ? moment.localeData(culture) : moment.localeData();
      const calculatedWeekStart = data ? data.firstDayOfWeek() : 0;

      // Ensure calculatedWeekStart matches StartOfWeek type
      weekStart = Math.min(Math.max(calculatedWeekStart, 0), 6) as StartOfWeek;
    }

    return weekStart;
  };

  const eventDefaultBackgroundColor = Color(
    isHexColor(props.pcfContext.parameters.eventDefaultColor?.raw || "")
      ? (props.pcfContext.parameters.eventDefaultColor.raw as string)
      : "#3174ad"
  );
  const calendarTodayBackgroundColor = Color(
    isHexColor(
      props.pcfContext.parameters.calendarTodayBackgroundColor?.raw || ""
    )
      ? (props.pcfContext.parameters.calendarTodayBackgroundColor.raw as string)
      : "#eaf6ff"
  );
  const calendarTextColor = Color(
    isHexColor(props.pcfContext.parameters.calendarTextColor?.raw || "")
      ? (props.pcfContext.parameters.calendarTextColor.raw as string)
      : "#666666"
  );
  const calendarBorderColor = Color(
    isHexColor(props.pcfContext.parameters.calendarBorderColor?.raw || "")
      ? (props.pcfContext.parameters.calendarBorderColor.raw as string)
      : "#dddddd"
  );
  const calendarTimeBarBackgroundColor = Color(
    isHexColor(
      props.pcfContext.parameters.calendarTimeBarBackgroundColor?.raw || ""
    )
      ? (props.pcfContext.parameters.calendarTimeBarBackgroundColor
          .raw as string)
      : "#ffffff"
  );
  const weekStartDay =
    props.pcfContext.parameters.calendarWeekStart?.raw || null;
  const calendarCulture = getISOLanguage(props.pcfContext);
  const calendarMessages = GetMessages(calendarCulture);
  const calendarRtl = props.pcfContext.userSettings.isRTL;
  const calendarScrollTo = moment()
    .set({
      hour: props.pcfContext.parameters.calendarScrollToTime?.raw || 0,
      minute: 0,
      seconds: 0,
    })
    .toDate();

  const calendarViews = getCalendarViews(
    props.pcfContext,
    localizer,
    calendarScrollTo
  );

  const [calendarView, setCalendarView] = React.useState(
    getCalendarView(
      calendarViews,
      props.pcfContext.parameters.calendarView?.raw || ""
    )
  );

  const [calendarData, setCalendarData] = React.useState<{
    resources: Resource[] | undefined;
    events: IEvent[];
    keys: Keys | undefined;
  }>({ resources: [], events: [], keys: undefined });
  const [calendarDate, setCalendarDate] = React.useState(
    props.pcfContext.parameters.calendarDate?.raw?.getTime() === 0
      ? moment().toDate()
      : props.pcfContext.parameters.calendarDate?.raw || moment().toDate()
  );
  const calendarRef = React.useRef(null);

  //sets the keys and calendar data when the control is loaded or the calendarDataSet changes.
  React.useEffect(() => {
    async function asyncCalendarData() {
      let keys = calendarData.keys;
      if (!keys) {
        keys = await getKeys(props.pcfContext);
      }

      const dataSet = props.pcfContext.parameters.calendarDataSet;
      if (dataSet.loading === false) {
        const calendarDataResult = await getCalendarData(
          props.pcfContext,
          keys
        );

        // Ensure all required fields are defined
        setCalendarData({
          resources:
            calendarDataResult.resources &&
            calendarDataResult.resources.length > 0
              ? calendarDataResult.resources
              : undefined,
          events: calendarDataResult.events || [],
          keys: calendarDataResult.keys || undefined,
        });
      }
    }
    asyncCalendarData();
  }, [props.pcfContext.parameters.calendarDataSet.records]);

  //allows for changing the calendar date if a date/time field is utilized in canvas on the input parameters
  React.useEffect(() => {
    //this appears to be firing every time a render happens...

    if (
      props.pcfContext.parameters.calendarDate?.raw?.getTime() !== 0 &&
      !moment(calendarDate).isSame(props.pcfContext.parameters.calendarDate.raw)
    ) {
      setCalendarDate(props.pcfContext.parameters.calendarDate.raw as Date);
    }
  }, [props.pcfContext.parameters.calendarDate?.raw?.getTime()]);

  //allows for changing the calendar view if a user decides to add in custom button for the view in canvas
  React.useEffect(() => {
    if (
      props.pcfContext.parameters.calendarView?.raw &&
      calendarView != props.pcfContext.parameters.calendarView.raw
    ) {
      setCalendarView(
        getCalendarView(
          calendarViews,
          props.pcfContext.parameters.calendarView.raw
        )
      );
    }
  }, [props.pcfContext.parameters.calendarView?.raw]);

  React.useEffect(() => {
    if (calendarDate && calendarView) {
      _onCalendarChange();
    }
  }, [calendarDate, calendarView]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--calendar-text-color",
      calendarTextColor.toString()
    );
    root.style.setProperty(
      "--calendar-text-color-grayscale",
      calendarTextColor.grayscale().toString()
    );
    root.style.setProperty(
      "--calendar-border-color",
      calendarBorderColor.toString()
    );
    root.style.setProperty(
      "--calendar-timebar-background-color",
      calendarTimeBarBackgroundColor.toString()
    );
    root.style.setProperty(
      "--calendar-show-more-hover",
      calendarTextColor.isDark()
        ? calendarTextColor.grayscale().fade(0.8).toString()
        : calendarTextColor.grayscale().fade(0.2).toString()
    );
    cssVars({
      preserveVars: true, // Keep original var() declarations
      watch: true, // Watch for changes in styles or DOM updates
      onlyLegacy: true, // Run only in browsers that lack native CSS variable support
    });
  }, [
    props.pcfContext.parameters.eventDefaultColor?.raw,
    props.pcfContext.parameters.calendarTodayBackgroundColor?.raw,
    props.pcfContext.parameters.calendarTextColor?.raw,
    props.pcfContext.parameters.calendarBorderColor?.raw,
    props.pcfContext.parameters.calendarTimeBarBackgroundColor?.raw,
  ]);

  //when an event is selected it return the events id in canvas and open the record in model app
  const _handleEventSelected = (event: IEvent) => {
    const eventId = event.id as string;

    props.onClickSelectedRecord(event.id as string);

    //if we are in a model app open the record when it's selected.
    if (props.pcfContext.mode.allocatedHeight === -1) {
      props.pcfContext.navigation.openForm({
        entityId: eventId,
        entityName:
          props.pcfContext.parameters.calendarDataSet.getTargetEntityType(),
        openInNewWindow: false,
      });
    }
  };

  //when an empty area on the calendar is selected this output the values for the selected range in canvas
  //and opens the record in model.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _handleSlotSelect = (slotInfo: any) => {
    props.onClickSlot(slotInfo.start, slotInfo.end, slotInfo.resourceId || "");

    // Check if the app is running in a model-driven app context
    if (props.pcfContext.mode.allocatedHeight === -1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newRecordProperties: any = {};

      // Safely add properties for start and end
      if (calendarData.keys?.start) {
        newRecordProperties[calendarData.keys.start] =
          formatDateAsParameterString(slotInfo.start);
      }

      if (calendarData.keys?.end) {
        newRecordProperties[calendarData.keys.end] =
          formatDateAsParameterString(slotInfo.end);
      }

      // Handle resources
      if (
        calendarData.keys?.resource &&
        slotInfo.resourceId &&
        Array.isArray(calendarData.resources)
      ) {
        const resourceInfo = calendarData.resources.find(
          (x) => x.id === slotInfo.resourceId
        );

        if (resourceInfo) {
          newRecordProperties[calendarData.keys.resource] = resourceInfo.id;
          if (calendarData.keys.resource + "name" in resourceInfo) {
            newRecordProperties[calendarData.keys.resource + "name"] =
              resourceInfo.title;
          }
          if (calendarData.keys.resource + "type" in resourceInfo) {
            newRecordProperties[calendarData.keys.resource + "type"] =
              resourceInfo.etn;
          }
        }
      }

      // Open the form with the constructed properties
      props.pcfContext.navigation.openForm(
        {
          entityName:
            props.pcfContext.parameters.calendarDataSet.getTargetEntityType() ||
            "",
          openInNewWindow: false,
        },
        newRecordProperties
      );
    }
  };

  //required event when using a variable for the Calendar Date
  const _handleNavigate = (date: Date, view: string, action: string) => {
    setCalendarDate(moment(date).toDate());
  };

  const _handleOnView = (view: string) => {
    setCalendarView(getCalendarView(calendarViews, view));
  };

  const _onCalendarChange = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = calendarRef.current as any;
    const rangeDates = getCurrentRange(
      calendarDate,
      ref.props.view,
      ref.props.culture
    );
    props.onCalendarChange(
      ref.props.date,
      rangeDates.start,
      rangeDates.end,
      ref.props.view
    );
  };

  const eventPropsGetter = (event: IEvent) => {
    return {
      style: {
        backgroundColor: event.color || eventDefaultBackgroundColor.toString(),
        color: Color(event.color || eventDefaultBackgroundColor).isDark()
          ? "#fff"
          : "#000",
        borderColor: calendarBorderColor.toString(),
      },
    };
  };

  const dayPropsGetter = (date: Date) => {
    if (moment(date).startOf("day").isSame(moment().startOf("day")))
      return {
        style: {
          backgroundColor: calendarTodayBackgroundColor.toString(),
        },
      };
    else return {};
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agendaEvent = ({ event }: any) => {
    return (
      <span
        title={event.title}
        style={{
          overflow: "auto",
          display: "block",
          backgroundColor:
            event.color || eventDefaultBackgroundColor.toString(),
          padding: "5px",
          color: Color(event.color || eventDefaultBackgroundColor).isDark()
            ? "#fff"
            : "#000",
        }}
      >
        {event.title}
      </span>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resourceHeader = ({ label }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = calendarRef.current as any;
    return <span>{label}</span>;
  };

  const timeGutterHeader = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = calendarRef.current as any;
    return (
      <span
        title={ref ? ref.props.messages.allDay : ""}
        className="rbc-time-header-gutter-all-day"
      >
        {ref ? ref.props.messages.allDay : ""}
      </span>
    );
  };

  return !calendarData?.resources ? (
    <Calendar
      selectable
      localizer={localizer}
      date={calendarDate}
      culture={calendarCulture}
      rtl={calendarRtl}
      messages={calendarMessages}
      defaultView={calendarView}
      view={calendarView}
      views={calendarViews}
      scrollToTime={calendarScrollTo}
      events={calendarData.events}
      onSelectEvent={_handleEventSelected}
      onSelectSlot={_handleSlotSelect}
      onNavigate={_handleNavigate}
      onView={_handleOnView}
      ref={calendarRef}
      className={`rbc-view-${calendarView}`}
      eventPropGetter={eventPropsGetter}
      dayPropGetter={dayPropsGetter}
      components={{
        agenda: {
          event: agendaEvent,
        },
        timeGutterHeader: timeGutterHeader,
      }}
    />
  ) : (
    <Calendar
      selectable
      localizer={localizer}
      date={calendarDate}
      culture={calendarCulture}
      messages={calendarMessages}
      defaultView={calendarView}
      view={calendarView}
      views={calendarViews}
      scrollToTime={calendarScrollTo}
      events={calendarData.events}
      onSelectEvent={_handleEventSelected}
      onSelectSlot={_handleSlotSelect}
      onNavigate={_handleNavigate}
      onView={_handleOnView}
      resources={calendarData.resources}
      resourceAccessor="resource"
      ref={calendarRef}
      className={`rbc-view-${calendarView}`}
      eventPropGetter={eventPropsGetter}
      dayPropGetter={dayPropsGetter}
      components={{
        agenda: {
          event: agendaEvent,
        },
        resourceHeader: resourceHeader,
        timeGutterHeader: timeGutterHeader,
      }}
    />
  );
};

//gets all the fields names and other keys will will need while processing the data
async function getKeys(
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

  //if we are in a model app let's get additional info about the resource
  if (
    pcfContext.mode.allocatedHeight === -1 &&
    resource &&
    resourceGetAllInModel
  ) {
    //get the resource entity name
    const eventMeta = await pcfContext.utils.getEntityMetadata(
      ///@ts-expect-error contextInfo access
      pcfContext.mode.contextInfo.entityTypeName,
      [resource]
    );
    resourceEtn = eventMeta.Attributes.getByName(resource).Targets[0];
    //get the resource primary name and id fields for resource.
    const resourceMeta = await pcfContext.utils.getEntityMetadata(resourceEtn);
    resourceName = resourceName
      ? resourceName
      : resourceMeta.PrimaryNameAttribute;
    resourceId = resourceMeta.PrimaryIdAttribute;
  }

  return {
    id: params.eventId.raw ? getFieldName(dataSet, params.eventId.raw) : "",
    name: params.eventFieldName.raw
      ? getFieldName(dataSet, params.eventFieldName.raw)
      : "",
    start: params.eventFieldStart.raw
      ? getFieldName(dataSet, params.eventFieldStart.raw)
      : "",
    end: params.eventFieldEnd.raw
      ? getFieldName(dataSet, params.eventFieldEnd.raw)
      : "",
    eventColor: params.eventColor.raw
      ? getFieldName(dataSet, params.eventColor.raw)
      : "",
    resource: resource,
    resourceName: resourceName,
    resourceId: resourceId,
    resourceGetAllInModel: resourceGetAllInModel,
    resourceEtn: resourceEtn,
  };
}

//gets fields name from the datsource columns and provides the necessary alias information for
//related entities.
function getFieldName(
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
async function getCalendarData(
  pcfContext: ComponentFramework.Context<IInputs>,
  keys?: Keys
): Promise<{
  resources?: Resource[];
  events: Event[];
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

async function getAllResources(
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
async function getEvents(
  pcfContext: ComponentFramework.Context<IInputs>,
  resources: Resource[] | undefined,
  keys: Keys
): Promise<Event[]> {
  const dataSet = pcfContext.parameters.calendarDataSet;
  const totalRecordCount = dataSet.sortedRecordIds.length;

  const newEvents: Event[] = [];

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

//format the date/time so that it can be passed as a parameter to a Dynamics form
function formatDateAsParameterString(date: Date) {
  //months are zero index so don't forget to add one :)
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}

function getCalendarView(calendarViews: ViewsProps, viewName: string): View {
  const calView = Object.keys(calendarViews).find(
    (x: string) => x === viewName.toLowerCase()
  );
  return calView ? (calView as View) : (Object.keys(calendarViews)[0] as View);
}

function getCalendarViews(
  pcfContext: ComponentFramework.Context<IInputs>,
  localizer: DateLocalizer,
  scrollToTime: Date
): ViewsProps {
  const viewList = pcfContext.parameters.calendarAvailableViews?.raw || "month";
  const validViews = viewList
    .split(",")
    .filter((x) => allViews.indexOf(x.trim()) !== -1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedViews: any = {};
  if (validViews.length < 1) {
    selectedViews.week = true;
  } else {
    validViews.forEach((view: string) => {
      if (view === "work_week") {
        selectedViews.work_week = CustomWorkWeek;
        selectedViews.work_week.localizer = localizer;
        selectedViews.work_week.scrollToTime = scrollToTime;
        selectedViews.work_week.includedDays =
          getWorkWeekIncludedDays(pcfContext);
      } else {
        selectedViews[view] = true;
      }
    });
  }
  return selectedViews;
}

function getWorkWeekIncludedDays(
  pcfContext: ComponentFramework.Context<IInputs>
): number[] {
  if (
    pcfContext.parameters.calendarWorkWeekDays &&
    pcfContext.parameters.calendarWorkWeekDays.raw
  ) {
    return pcfContext.parameters.calendarWorkWeekDays.raw
      .split(",")
      .map((x) => {
        return +x - 1;
      });
  } else {
    return [1, 2, 3, 4, 5];
  }
}

function getCurrentRange(
  date: Date,
  view: string,
  culture: string
): { start: Date; end: Date } {
  let start = moment().toDate(),
    end = moment().toDate();
  if (view === "day") {
    start = moment(date).startOf("day").toDate();
    end = moment(date).endOf("day").toDate();
  } else if (view === "week") {
    start = moment(date).startOf("week").toDate();
    end = moment(date).endOf("week").toDate();
  } else if (view === "work_week") {
    start = moment(date).weekday(1).toDate();
    end = moment(date).weekday(5).toDate();
  } else if (view === "month") {
    start = moment(date).startOf("month").startOf("week").toDate();
    end = moment(date).endOf("month").endOf("week").toDate();
  } else if (view === "agenda") {
    start = moment(date).startOf("day").toDate();
    end = moment(date).endOf("day").add(1, "month").toDate();
  }
  return { start, end };
}

function getISOLanguage(
  pcfContext: ComponentFramework.Context<IInputs>
): string {
  //look for a language setting coming in from the parameters.
  //if nothing was entered use an empty string which will default to en
  let lang = pcfContext.parameters.calendarLanguage?.raw || "";

  //if this is a model app and a language was not added as an input then user the current users
  // language settings.
  if (!lang && pcfContext.mode.allocatedHeight === -1) {
    lang = lcid.from(pcfContext.userSettings.languageId);
    return lang.substring(0, lang.indexOf("_"));
  }

  return lang;
}
