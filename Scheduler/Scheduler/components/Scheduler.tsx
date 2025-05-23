import * as React from "react";
import { ViewType, SchedulerData, EventItem, SchedulerDataConfig, View, ResourceEvent } from "react-big-schedule";
import SchedulerWrapper from "./schedulerWrapper";
import { usePcfContext } from "../services/pcfContext";
import "react-big-schedule/dist/css/style.css";
import "../resources/schedulerOverrides.css";
import { ISchedulerControlProps, Resource, Event, SchedulerAction } from "../types";
import { getViewByName } from "../types/schedulerViews";
import { getCustomDate } from "../services/schedulerBehaviors";
import { getKeys, getSchedulerData } from "../services/calendarDataService"; // <-- Use your real data service
import { useAvailableViews, useShowHeader, useNonWorkingTimeColors, useWorkWeekDays, useDayViewOptions, useDisplayWeekend, useSchedulerView, useSchedulerDate, useSchedulerLanguage, useResourceNameHeader } from "../hooks";
import { parseDateOnly, getLocaleFromLanguage } from "../utils/formattingHelpers";
import '../utils/locales';
import { createEventClickedCallback, createNewEventCallback, createOnViewChangeCallback, createPrevClickCallback, createNextClickCallback, createSlotClickedFuncCallback, createToggleExpandFuncCallback } from "./callbacks";
import { eventItemTemplateResolver, eventItemPopoverTemplateResolver } from "./renderers";

// Initial state for the scheduler reducer
const initialState = {
    showScheduler: false,
    schedulerData: null as SchedulerData | null,
};

// Reducer to manage scheduler state transitions
function reducer(state: typeof initialState, action: SchedulerAction) {
    switch (action.type) {
        case "INITIALIZE":
            return { showScheduler: true, schedulerData: action.payload };
        case "UPDATE_SCHEDULER":
            return { ...state, schedulerData: action.payload };
        default:
            return state;
    }
}

// SchedulerControl is the main visual component for the Scheduler PCF control.
// It manages state, data loading, and event handlers for the scheduler UI.
const SchedulerControl: React.FC<ISchedulerControlProps> = React.memo((props) => {
    // Ref to the parent container div for sizing and focus management
    const parentRef = React.useRef<HTMLDivElement>(null);
    // Access the PCF context service
    const pcfContext = usePcfContext();
    // State management for scheduler data and visibility
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // Local state for resources and events
    const [resources, setResources] = React.useState<Resource[]>([]);
    const [events, setEvents] = React.useState<Event[]>([]);


    // Custom hooks for scheduler configuration and state
    const availableViews = useAvailableViews(pcfContext, state, dispatch);
    const showHeader = useShowHeader(pcfContext, state, dispatch);
    const resourceNameHeader = useResourceNameHeader(pcfContext, state, dispatch);
    const schedulerLanguage = useSchedulerLanguage(pcfContext.context, state.schedulerData, dispatch);
    const workWeekDays = useWorkWeekDays(pcfContext, state.schedulerData, dispatch);
    const displayWeekend = useDisplayWeekend(pcfContext, state.schedulerData, dispatch);
    const nonWorkingTimeColors = useNonWorkingTimeColors(pcfContext, state.schedulerData, dispatch);
    const dayViewHours = useDayViewOptions(pcfContext, state.schedulerData, dispatch);
    const [schedulerView, setSchedulerView] = useSchedulerView(
        pcfContext,
        availableViews,
        state,
        events,
        dispatch,
        props.onDateChange,
    );
    const [schedulerDate, setSchedulerDate] = useSchedulerDate(
        pcfContext,
        state,
        events,
        dispatch,
        schedulerView,
        props.onDateChange,
    );


    // Effect: Fetch scheduler data (resources and events) when the scheduler is shown or data changes
    React.useEffect(() => {
        let isMounted = true;
        async function fetchSchedulerData() {
            if (!state.schedulerData || !state.showScheduler) return;
            const keys = await getKeys(pcfContext.context);
            const { resources, events } = await getSchedulerData(pcfContext.context, keys);

            setResources(resources);
            setEvents(events);

            if (!isMounted) return;

            state.schedulerData?.setResources(resources);
            state.schedulerData?.setEvents(events);
            dispatch({ type: "UPDATE_SCHEDULER", payload: state.schedulerData });
        }
        fetchSchedulerData();
        return () => { isMounted = false; };
    }, [state.showScheduler, props.context.parameters.schedulerDataSet.records]);


    // Effect: Notify parent when the date or view changes
    React.useEffect(() => {
        if (
            state.schedulerData &&
            schedulerDate &&
            schedulerView &&
            typeof props.onDateChange === "function"
        ) {
            props.onDateChange(
                // Use your parseDateOnly helper if needed to avoid timezone issues
                parseDateOnly(schedulerDate),
                state.schedulerData.getViewStartDate().toDate(),
                state.schedulerData.getViewEndDate().toDate(),
                schedulerView
            );
        }
        // Only run when schedulerData is initialized or relevant dependencies change
    }, [events]);

    // Effect: Initialize the scheduler data on mount
    React.useEffect(() => {
        let isMounted = true;
        async function loadSchedulerData() {
            if (!isMounted) return;

            // Find the viewType for the current schedulerView
            const currentView = getViewByName(availableViews, schedulerView);
            const viewType = currentView?.viewType ?? availableViews[0]?.viewType ?? ViewType.Week;

            // Scheduler configuration object
            const config: SchedulerDataConfig = {
                responsiveByParent: true,
                schedulerWidth: `100%` as `${number}%`,
                besidesWidth: 0,
                schedulerContentHeight: "100%",
                schedulerMaxHeight: pcfContext.height as number,
                eventItemPopoverTrigger: "click" as "click", // eslint-disable-line @typescript-eslint/prefer-as-const
                views: availableViews,
                headerEnabled: showHeader,
                viewChangeSpinEnabled: true,
                resourceName: resourceNameHeader,
                displayWeekend: displayWeekend,
                nonWorkingTimeHeadColor: nonWorkingTimeColors.headColor,
                nonWorkingTimeHeadBgColor: nonWorkingTimeColors.headBgColor,
                nonWorkingTimeBodyBgColor: nonWorkingTimeColors.bodyBgColor,
                dayStartFrom: dayViewHours.startHour,
                dayStopTo: dayViewHours.endHour,
                minuteStep: dayViewHours.minuteStep,
            };
            const schedulerConfig = { ...config, workWeekDays };

            // Create the SchedulerData instance
            const sd = new SchedulerData(
                new Date().toISOString().slice(0, 10),
                viewType,
                false,
                false,
                schedulerConfig, { getCustomDateFunc: getCustomDate }
            );
            sd.setSchedulerLocale(schedulerLanguage);
            sd.setCalendarPopoverLocale(getLocaleFromLanguage(schedulerLanguage));
            sd.setResources(resources);
            sd.setEvents(events);
            dispatch({ type: "INITIALIZE", payload: sd });
        }

        loadSchedulerData();
        return () => { isMounted = false; };
    }, []);


    // Handler: Go to previous date range (moved to callbacks/prevClick.ts)
    const prevClick = React.useCallback(
        createPrevClickCallback(events, schedulerView, dispatch, props.onDateChange),
        [events, schedulerView, dispatch, props.onDateChange]
    );

    // Handler: Go to next date range (moved to callbacks/nextClick.ts)
    const nextClick = React.useCallback(
        createNextClickCallback(events, schedulerView, dispatch, props.onDateChange),
        [events, schedulerView, dispatch, props.onDateChange]
    );

    // Handler: Change the scheduler view (day, week, etc.) (moved to callbacks/onViewChange.ts)
    const onViewChange = React.useCallback(
        createOnViewChangeCallback(availableViews, setSchedulerView),
        [availableViews, setSchedulerView]
    );

    // Handler: Select a new date
    const onSelectDate = React.useCallback((schedulerData: SchedulerData, date: string) => {
        setSchedulerDate(date);
    }, [setSchedulerDate]);


    // Handler: Event item clicked (moved to callbacks/eventClicked.ts)
    const eventClicked = React.useCallback(
        createEventClickedCallback(props.onClickSelectedRecord),
        [props.onClickSelectedRecord]
    );

    // Handler: Slot item clicked (resource row) (moved to callbacks/slotClickedFunc.ts)
    const slotClickedFunc = React.useCallback(
        createSlotClickedFuncCallback(props.onClickSelectedSlot),
        [props.onClickSelectedSlot]
    );

    // Handler: Toggle expand/collapse for resource rows (moved to callbacks/toggleExpandFunc.ts)
    const toggleExpandFunc = React.useCallback(
        createToggleExpandFuncCallback(dispatch),
        [dispatch]
    );

    // Handler: New event creation (moved to callbacks/newEvent.ts)
    const newEvent = React.useCallback(
        createNewEventCallback(props.onNewEvent),
        [props.onNewEvent]
    );

    // Render the scheduler UI or a loading state
    return (
        <div
            ref={parentRef}
            style={{ width: "100%", height: "100%" }}
            className="scheduler-container"
            role="region"
            aria-label="Scheduler"
        >
            {state.showScheduler && state.schedulerData ? (
                <SchedulerWrapper
                    parentRef={parentRef}
                    schedulerData={state.schedulerData}
                    prevClick={prevClick}
                    nextClick={nextClick}
                    onSelectDate={onSelectDate}
                    onViewChange={onViewChange}
                    eventItemClick={eventClicked}
                    toggleExpandFunc={toggleExpandFunc}
                    slotClickedFunc={slotClickedFunc}
                    newEvent={newEvent}
                    eventItemTemplateResolver={eventItemTemplateResolver}
                    eventItemPopoverTemplateResolver={eventItemPopoverTemplateResolver}
                />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
});

export default SchedulerControl;