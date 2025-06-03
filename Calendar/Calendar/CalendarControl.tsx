/*
 * @Author: richard.wilson
 * @Date: 2020-05-09 07:38:02
 * @Last Modified by: Rick Wilson
 * @Last Modified time: 2024-12-17 13:16:53
 */
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./css/react-big-calendar.override.css";
import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import {
  Calendar,
  momentLocalizer,
  View,
  SlotInfo,
  EventProps, ResourceHeaderProps
} from "react-big-calendar";
import * as CalendarUtils from "./utils";
import { StartOfWeek } from "date-arithmetic";
import { IEvent, Resource } from "./types";
import GetMessages from "./components/Translations";
import * as moment from "moment";
import { useCalendarHourRange, useDayLayoutAlgorithm, useEventSelectable, useCalendarSelectable, useCalendarStepAndTimeslots, useCalendarDate, useCalendarPopup, useEventHeaderFormat, useCalendarView, useCalendarData, useCalendarColors } from "./hooks";
import { eventPropsGetter, dayPropsGetter } from "./getters";
import { handleSlotSelect, handleEventSelected, handleEventKeyPress, handleOnView, handleNavigate } from "./handlers";
import { timeGutterHeaderRenderer, resourceHeaderRenderer, agendaEventRenderer,timeSlotWrapperRenderer } from "./renderers";
import { tooltipAccessor } from "./accessors/tooltipAccessor";
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

  const { min, max } = useCalendarHourRange(props.pcfContext, moment);

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

  const eventHeaderFormat = useEventHeaderFormat(props.pcfContext);

  const [calendarView, setCalendarView] = useCalendarView(
    calendarViews,
    props.pcfContext.parameters.calendarView?.raw || ""
  );
  // Adapter for setCalendarView to match (view: string) => void signature
  const setCalendarViewString = (view: string) => setCalendarView(view as View);

  // Use custom hook for calendarDate, pass localized moment
  const [calendarDate, setCalendarDate] = useCalendarDate(props.pcfContext, moment);
  const calendarRef = React.useRef(null);
  const [calendarData, setCalendarData] = useCalendarData(props.pcfContext);

  React.useEffect(() => {
    if (calendarDate && calendarView) {
      _onCalendarChange();
    }
  }, [calendarDate, calendarView]);

  const {
    eventDefaultBackgroundColor,
    calendarTodayBackgroundColor,
    calendarTextColor,
    calendarBorderColor,
    calendarTimeBarBackgroundColor,
    weekendColor,
  } = useCalendarColors(props.pcfContext, eventHeaderFormat);

  // Use handleEventSelected from handlers
  const _handleEventSelected = handleEventSelected(
    isEventSelectable,
    props.onClickSelectedRecord,
    props.pcfContext
  );

  const _handleEventKeyPress = handleEventKeyPress(_handleEventSelected);

  // Use handleSlotSelect from handlers
  // Adapter function to ensure correct typing for react-big-calendar
  const _handleSlotSelect = (slotInfo: SlotInfo) =>
    handleSlotSelect(props.onClickSlot, props.pcfContext, calendarData)({
      ...slotInfo,
      resourceId: slotInfo.resourceId ? String(slotInfo.resourceId) : undefined,
    });

  // Use handleNavigate from handlers
  const _handleNavigate = handleNavigate(setCalendarDate, setCalendarViewString);

  // Use handleOnView from handlers
  const _handleOnView = handleOnView(setCalendarViewString);

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

  const _dayPropsGetter = (date: Date, _resourceId?: string | number) =>
    dayPropsGetter(date, calendarTodayBackgroundColor, weekendColor, moment);


  // Use agendaEventRenderer from renderers
  const agendaEvent: React.ComponentType<EventProps<IEvent>> = (props) =>
    agendaEventRenderer(props, isEventSelectable, eventDefaultBackgroundColor);

  // Use resourceHeaderRenderer from renderers
  const resourceHeader: React.ComponentType<ResourceHeaderProps<Resource>> = (props) =>
    resourceHeaderRenderer(props);

  // Use timeGutterHeaderRenderer from renderers
  const timeGutterHeader: React.ComponentType = () => {
    const ref = calendarRef.current// as any;
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
      tooltipAccessor={tooltipAccessor}
      components={{
        agenda: {
          event: agendaEvent,
        },
        timeGutterHeader: timeGutterHeader,
        timeSlotWrapper: (props) => timeSlotWrapperRenderer({ ...props, timeslots }),
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
      tooltipAccessor={tooltipAccessor}
      components={{
        agenda: {
          event: agendaEvent,
        },
        resourceHeader: resourceHeader,
        timeGutterHeader: timeGutterHeader,
        timeSlotWrapper: (props) => timeSlotWrapperRenderer({ ...props, timeslots }),
      }}
    />
  );
};