/*
 * @Author: richard.wilson
 * @Date: 2020-05-09 07:38:02
 * @Last Modified by: Rick Wilson
 * @Last Modified time: 2024-12-17 13:16:53
 */
import cssVars from "css-vars-ponyfill";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./css/react-big-calendar.override.css";
import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import {
  Calendar,
  momentLocalizer,
  View,
  DayLayoutAlgorithm,
} from "react-big-calendar";
import * as CalendarUtils from "./utils";
import { StartOfWeek } from "date-arithmetic";
import { Resource, Keys, IEvent } from "./types";
import GetMessages from "./components/Translations";
import * as moment from "moment";
import * as Color from "color";
import isHexColor from "is-hexcolor";

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
      : CalendarUtils.DEFAULT_EVENT_COLOR
  );
  const calendarTodayBackgroundColor = Color(
    isHexColor(
      props.pcfContext.parameters.calendarTodayBackgroundColor?.raw || ""
    )
      ? (props.pcfContext.parameters.calendarTodayBackgroundColor.raw as string)
      : CalendarUtils.DEFAULT_TODAY_BACKGROUND_COLOR
  );
  const calendarTextColor = Color(
    isHexColor(props.pcfContext.parameters.calendarTextColor?.raw || "")
      ? (props.pcfContext.parameters.calendarTextColor.raw as string)
      : CalendarUtils.DEFAULT_TEXT_COLOR
  );
  const calendarBorderColor = Color(
    isHexColor(props.pcfContext.parameters.calendarBorderColor?.raw || "")
      ? (props.pcfContext.parameters.calendarBorderColor.raw as string)
      : CalendarUtils.DEFAULT_BORDER_COLOR
  );
  const calendarTimeBarBackgroundColor = Color(
    isHexColor(
      props.pcfContext.parameters.calendarTimeBarBackgroundColor?.raw || ""
    )
      ? (props.pcfContext.parameters.calendarTimeBarBackgroundColor
          .raw as string)
      : CalendarUtils.DEFAULT_TIMEBAR_BACKGROUND_COLOR
  );

  const [weekendColor, setWeekendColor] = React.useState<string>(
    isHexColor(props.pcfContext.parameters.weekendBackgroundColor?.raw || "")
      ? props.pcfContext.parameters.weekendBackgroundColor.raw!
      : CalendarUtils.DEFAULT_WEEKEND_BACKGROUND_COLOR
  );

  React.useEffect(() => {
    const color = isHexColor(
      props.pcfContext.parameters.weekendBackgroundColor?.raw || ""
    )
      ? props.pcfContext.parameters.weekendBackgroundColor.raw!
      : CalendarUtils.DEFAULT_WEEKEND_BACKGROUND_COLOR;
    setWeekendColor(color);
  }, [props.pcfContext.parameters.weekendBackgroundColor?.raw]);

  const weekStartDay =
    props.pcfContext.parameters.calendarWeekStart?.raw || null;
  const calendarCulture = CalendarUtils.getISOLanguage(props.pcfContext);
  const calendarMessages = GetMessages(calendarCulture);
  const calendarRtl = props.pcfContext.userSettings.isRTL;
  const calendarScrollTo = moment()
    .set({
      hour: props.pcfContext.parameters.calendarScrollToTime?.raw || 0,
      minute: 0,
      seconds: 0,
    })
    .toDate();

  // State to manage min and max hours
  const [minHour, setMinHour] = React.useState<number>(
    props.pcfContext.parameters.calendarMinHour?.raw ??
      CalendarUtils.DEFAULT_MIN_HOUR
  );
  const [maxHour, setMaxHour] = React.useState<number>(
    props.pcfContext.parameters.calendarMaxHour?.raw ??
      CalendarUtils.DEFAULT_MAX_HOUR
  );

  // Update minHour and maxHour when props change
  React.useEffect(() => {
    const newMinHour =
      props.pcfContext.parameters.calendarMinHour?.raw ??
      CalendarUtils.DEFAULT_MIN_HOUR;
    const newMaxHour =
      props.pcfContext.parameters.calendarMaxHour?.raw ??
      CalendarUtils.DEFAULT_MAX_HOUR;

    setMinHour(newMinHour);
    setMaxHour(newMaxHour);
  }, [
    props.pcfContext.parameters.calendarMinHour?.raw,
    props.pcfContext.parameters.calendarMaxHour?.raw,
  ]);

  // Convert minHour and maxHour to Date for Calendar component
  const min = React.useMemo(
    () => moment(`${minHour}:00`, "HH:mm").toDate(),
    [minHour]
  );
  const max = React.useMemo(
    () => moment(`${maxHour}:00`, "HH:mm").toDate(),
    [maxHour]
  );

  // State for step and timeslots
  const [step, setStep] = React.useState<number>(
    props.pcfContext.parameters.calendarStep?.raw ?? CalendarUtils.DEFAULT_STEP // Default: 2 slots per hour (30 minutes)
  );
  const [timeslots, setTimeslots] = React.useState<number>(
    props.pcfContext.parameters.calendarTimeSlots?.raw ??
      CalendarUtils.DEFAULT_TIMESLOTS // Default: 2
  );

  // Update step and timeslots when props change
  React.useEffect(() => {
    const newStep =
      props.pcfContext.parameters.calendarStep?.raw ??
      CalendarUtils.DEFAULT_STEP;
    const newTimeslots =
      props.pcfContext.parameters.calendarTimeSlots?.raw ??
      CalendarUtils.DEFAULT_TIMESLOTS;

    setStep(newStep);
    setTimeslots(newTimeslots);
  }, [
    props.pcfContext.parameters.calendarStep?.raw,
    props.pcfContext.parameters.calendarTimeSlots?.raw,
  ]);

  const [dayLayoutAlgorithm, setDayLayoutAlgorithm] =
    React.useState<DayLayoutAlgorithm>(
      (props.pcfContext.parameters.dayLayoutAlgorithm
        ?.raw as DayLayoutAlgorithm) || CalendarUtils.DEFAULT_LAYOUT_ALGORITHM
    );

  React.useEffect(() => {
    const algorithm =
      (props.pcfContext.parameters.dayLayoutAlgorithm
        ?.raw as DayLayoutAlgorithm) || CalendarUtils.DEFAULT_LAYOUT_ALGORITHM;
    setDayLayoutAlgorithm(algorithm);
  }, [props.pcfContext.parameters.dayLayoutAlgorithm?.raw]);

  const [calendarSelectable, setCalendarSelectable] = React.useState<boolean>(
    props.pcfContext.parameters.calendarSelectable?.raw?.toLowerCase() ===
      "false"
      ? false
      : CalendarUtils.DEFAULT_SELECTABLE
  );

  // useEffect to handle changes to the calendarSelectable property dynamically
  React.useEffect(() => {
    const selectableValue =
      props.pcfContext.parameters.calendarSelectable?.raw?.toLowerCase() ===
      "false"
        ? false
        : CalendarUtils.DEFAULT_SELECTABLE;
    setCalendarSelectable(selectableValue);
  }, [props.pcfContext.parameters.calendarSelectable?.raw]);

  const [isEventSelectable, setIsEventSelectable] = React.useState<boolean>(
    props.pcfContext.parameters.eventSelectable?.raw?.toLowerCase() === "false"
      ? false
      : CalendarUtils.DEFAULT_EVENT_SELECTABLE
  );

  // UseEffect to monitor and update selectable state
  React.useEffect(() => {
    const selectableValue =
      props.pcfContext.parameters.eventSelectable?.raw?.toLowerCase() ===
      "false"
        ? false
        : CalendarUtils.DEFAULT_EVENT_SELECTABLE;

    setIsEventSelectable(selectableValue);
  }, [props.pcfContext.parameters.eventSelectable?.raw]);

  const [calendarPopup, setCalendarPopup] = React.useState<boolean>(
    props.pcfContext.parameters.calendarPopup?.raw?.toLowerCase() === "false"
      ? false
      : CalendarUtils.DEFAULT_POPUP
  );

  // useEffect to handle changes to the calendarPopup property dynamically
  React.useEffect(() => {
    const popupValue =
      props.pcfContext.parameters.calendarPopup?.raw?.toLowerCase() === "false"
        ? false
        : CalendarUtils.DEFAULT_POPUP;
    setCalendarPopup(popupValue);
  }, [props.pcfContext.parameters.calendarPopup?.raw]);

  const calendarViews = CalendarUtils.getCalendarViews(
    props.pcfContext,
    localizer
  );

  const [calendarView, setCalendarView] = React.useState(
    CalendarUtils.getCalendarView(
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
        keys = await CalendarUtils.getKeys(props.pcfContext);
      }

      const dataSet = props.pcfContext.parameters.calendarDataSet;
      if (dataSet.loading === false) {
        const calendarDataResult = await CalendarUtils.getCalendarData(
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
        CalendarUtils.getCalendarView(
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
      calendarTextColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-text-color-grayscale",
      calendarTextColor.grayscale().array().toString()
    );
    root.style.setProperty(
      "--calendar-border-color",
      calendarBorderColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-timebar-background-color",
      calendarTimeBarBackgroundColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-show-more-hover",
      calendarTextColor.isDark()
        ? calendarTextColor.grayscale().fade(0.8).array().toString()
        : calendarTextColor.grayscale().fade(0.2).array().toString()
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
    // Check if the events are selectable
    if (!isEventSelectable) {
      return;
    }

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

  const _handleEventKeyPress = (
    event: IEvent,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const keyboardEvent = e as unknown as React.KeyboardEvent<HTMLElement>;
    if (CalendarUtils.VALID_KEYS.includes(keyboardEvent.key)) {
      _handleEventSelected(event);
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
          CalendarUtils.formatDateAsParameterString(slotInfo.start);
      }

      if (calendarData.keys?.end) {
        newRecordProperties[calendarData.keys.end] =
          CalendarUtils.formatDateAsParameterString(slotInfo.end);
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
    setCalendarView(CalendarUtils.getCalendarView(calendarViews, view));
  };

  const _onCalendarChange = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = calendarRef.current as any;
    const rangeDates = CalendarUtils.getCurrentRange(
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
        cursor: isEventSelectable ? "pointer" : "default",
        backgroundColor: event.color || eventDefaultBackgroundColor.toString(),
        color: Color(event.color || eventDefaultBackgroundColor).isDark()
          ? "#fff"
          : "#000",
        borderColor: calendarBorderColor.toString(),
      },
    };
  };

  const dayPropsGetter = (date: Date) => {
    // Check if the day is today
    if (moment(date).startOf("day").isSame(moment().startOf("day")))
      return {
        style: {
          backgroundColor: calendarTodayBackgroundColor.toString(),
        },
      };
    // Check if the day is a weekend (Saturday or Sunday)
    if (moment(date).day() === 0 || moment(date).day() === 6) {
      return {
        style: {
          backgroundColor: weekendColor.toString(),
        },
      };
    }
    return {};
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agendaEvent = ({ event }: any) => {
    return (
      <span
        title={event.title}
        style={{
          cursor: isEventSelectable ? "pointer" : "default",
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
      selectable={calendarSelectable}
      popup={calendarPopup}
      localizer={localizer}
      date={calendarDate}
      culture={calendarCulture}
      rtl={calendarRtl}
      messages={calendarMessages}
      defaultView={calendarView}
      view={calendarView}
      views={calendarViews}
      scrollToTime={calendarScrollTo}
      min={min}
      max={max}
      step={step} // Controls the interval in minutes for each time slot
      timeslots={timeslots} // Number of slots per hour
      dayLayoutAlgorithm={dayLayoutAlgorithm}
      events={calendarData.events}
      onSelectEvent={_handleEventSelected}
      onKeyPressEvent={_handleEventKeyPress}
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
      selectable={calendarSelectable}
      popup={calendarPopup}
      localizer={localizer}
      date={calendarDate}
      culture={calendarCulture}
      messages={calendarMessages}
      defaultView={calendarView}
      view={calendarView}
      views={calendarViews}
      scrollToTime={calendarScrollTo}
      min={min}
      max={max}
      step={step} // Controls the interval in minutes for each time slot
      timeslots={timeslots} // Number of slots per hour
      dayLayoutAlgorithm={dayLayoutAlgorithm}
      events={calendarData.events}
      onSelectEvent={_handleEventSelected}
      onKeyPressEvent={_handleEventKeyPress}
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