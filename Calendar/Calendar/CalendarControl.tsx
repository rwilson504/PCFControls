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
} from "react-big-calendar";
import * as CalendarUtils from "./utils";
import { StartOfWeek } from "date-arithmetic";
import { Resource, Keys, IEvent } from "./types";
import GetMessages from "./components/Translations";
import * as moment from "moment";
import * as Color from "color";
import isHexColor from "is-hexcolor";
import { useCalendarHourRange, useDayLayoutAlgorithm,useEventSelectable,useCalendarSelectable,useCalendarStepAndTimeslots,useCalendarDate, useCalendarPopup } from "./hooks";
import { eventPropsGetter, dayPropsGetter } from "./getters";
import { handleSlotSelect, handleEventSelected, handleEventKeyPress, handleOnView, handleNavigate } from "./handlers";
import { timeGutterHeaderRenderer, resourceHeaderRenderer, agendaEventRenderer } from "./renderers";


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

  const { minHour, maxHour } = useCalendarHourRange(props.pcfContext);

  // Convert minHour and maxHour to Date for Calendar component
  const min = React.useMemo(
    () => moment(`${minHour}:00`, "HH:mm").toDate(),
    [minHour]
  );
  const max = React.useMemo(
    () => moment(`${maxHour}:59:59`, "HH:mm:ss").toDate(),
    [maxHour]
  );

  // Use custom hook for step and timeslots
  const { step, timeslots } = useCalendarStepAndTimeslots(props.pcfContext);
  // Use custom hook for dayLayoutAlgorithm
  const dayLayoutAlgorithm = useDayLayoutAlgorithm(props.pcfContext);
  // Use custom hook for calendarSelectable
  const calendarSelectable = useCalendarSelectable(props.pcfContext);
  // Use custom hook for event selectable
  const isEventSelectable = useEventSelectable(props.pcfContext);
  // Use custom hook for calendarPopup
  const calendarPopup = useCalendarPopup(props.pcfContext);

  const calendarViews = CalendarUtils.getCalendarViews(
    props.pcfContext,
    localizer
  );

  const [eventHeaderFormat, setEventHeaderFormat] = React.useState<string>(
    props.pcfContext.parameters.eventHeaderFormat?.raw || "0"
  );

  React.useEffect(() => {
    const formatValue = props.pcfContext.parameters.eventHeaderFormat?.raw || "0";
    setEventHeaderFormat(formatValue);
  }, [props.pcfContext.parameters.eventHeaderFormat?.raw]);

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

  // Use custom hook for calendarDate, pass localized moment
  const [calendarDate, setCalendarDate] = useCalendarDate(props.pcfContext, moment);
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
    root.style.setProperty("--event-label-display",
      eventHeaderFormat === "1"
        ? "none"
        : "flex")
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
    eventHeaderFormat,
  ]);

  // Use handleEventSelected from handlers
  const _handleEventSelected = handleEventSelected(
    isEventSelectable,
    props.onClickSelectedRecord,
    props.pcfContext
  );

  const _handleEventKeyPress = handleEventKeyPress(_handleEventSelected);

  // Use handleSlotSelect from handlers
  // Adapter function to ensure correct typing for react-big-calendar
  const _handleSlotSelect = (slotInfo: any) =>
    handleSlotSelect(props.onClickSlot, props.pcfContext, calendarData)(slotInfo);

  // Use handleNavigate from handlers
  const _handleNavigate = handleNavigate(setCalendarDate);

  // Use handleOnView from handlers
  const _handleOnView = handleOnView(setCalendarView, calendarViews);

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


  // Adapter functions to match react-big-calendar signatures
  const _eventPropsGetter = (event: IEvent, start: Date, end: Date, isSelected: boolean) =>
    eventPropsGetter(event, isEventSelectable, eventDefaultBackgroundColor, calendarBorderColor);

  const _dayPropsGetter = (date: Date, ..._args: any[]) =>
    dayPropsGetter(date, calendarTodayBackgroundColor, weekendColor, moment);

  // Use agendaEventRenderer from renderers
  const agendaEvent = (args: any) => agendaEventRenderer(args, isEventSelectable, eventDefaultBackgroundColor);

  // Use resourceHeaderRenderer from renderers
  const resourceHeader = (args: any) => resourceHeaderRenderer(args);

  // Use timeGutterHeaderRenderer from renderers
  const timeGutterHeader = () => {
    const ref = calendarRef.current as any;
    return timeGutterHeaderRenderer(ref);
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
      eventPropGetter={_eventPropsGetter}
      dayPropGetter={_dayPropsGetter}
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
      eventPropGetter={_eventPropsGetter}
      dayPropGetter={_dayPropsGetter}
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