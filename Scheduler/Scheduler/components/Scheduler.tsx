import * as React from "react";
import { ViewType, SchedulerData } from "react-big-schedule";
import SchedulerWrapper from "./schedulerWrapper";
import { usePcfContext } from "../services/pcfContext";
import "react-big-schedule/dist/css/style.css";
import { ISchedulerControlProps, Resource, Event } from "../types";
import { getViewByName } from "../types/schedulerViews";
import { getCustomDate } from "../services/schedulerBehaviors";
import { getKeys, getSchedulerData } from "../services/calendarDataService"; // <-- Use your real data service
import { useAvailableViews, useShowHeader, useWorkWeekDays, useSchedulerView, useSchedulerDate, useSchedulerLanguage, useResourceNameHeader } from "../hooks";
import { parseDateOnly, getLocaleFromLanguage } from "../utils/formattingHelpers";
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/pt';
import 'antd/locale/en_US';
import 'antd/locale/es_ES';
import 'antd/locale/fr_FR';
import 'antd/locale/de_DE';
import 'antd/locale/pt_PT';

const initialState = {
    showScheduler: false,
    schedulerData: null as SchedulerData | null,
};

type SchedulerAction =
    | { type: "INITIALIZE"; payload: SchedulerData }
    | { type: "UPDATE_SCHEDULER"; payload: SchedulerData };

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

const SchedulerControl: React.FC<ISchedulerControlProps> = React.memo((props) => {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const pcfContext = usePcfContext();
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const [resources, setResources] = React.useState<Resource[]>([]);
    const [events, setEvents] = React.useState<Event[]>([]);

    const availableViews = useAvailableViews(pcfContext, state, dispatch);
    const showHeader = useShowHeader(pcfContext, state, dispatch);
    const resourceNameHeader = useResourceNameHeader(pcfContext, state, dispatch);
    const schedulerLanguage = useSchedulerLanguage(pcfContext.context, state.schedulerData, dispatch);
    const workWeekDays = useWorkWeekDays(pcfContext, state.schedulerData, dispatch);
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

    React.useEffect(() => {
        let isMounted = true;
        async function loadSchedulerData() {
            if (!isMounted) return;

            // Find the viewType for the current schedulerView
            const currentView = getViewByName(availableViews, schedulerView);
            const viewType = currentView?.viewType ?? availableViews[0]?.viewType ?? ViewType.Week;

            const config = {
                responsiveByParent: true,
                schedulerWidth: `100%` as `${number}%`,
                besidesWidth: 0,
                schedulerContentHeight: "100%",
                schedulerMaxHeight: pcfContext.height as number,
                eventItemPopoverTrigger: "click" as "click",
                views: availableViews,
                headerEnabled: showHeader,
                viewChangeSpinEnabled: true,
                resourceName: resourceNameHeader,
            };
            const schedulerConfig = { ...config, workWeekDays };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handler callbacks
    const prevClick = React.useCallback((schedulerData: SchedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
        props.onDateChange?.(schedulerData.getViewStartDate().toDate(), schedulerData.getViewStartDate().toDate(), schedulerData.getViewEndDate().toDate(), schedulerView);

    }, [events, schedulerView, props.onDateChange]);

    const nextClick = React.useCallback((schedulerData: SchedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
        props.onDateChange?.(schedulerData.getViewStartDate().toDate(), schedulerData.getViewStartDate().toDate(), schedulerData.getViewEndDate().toDate(), schedulerView);
    }, [events, schedulerView, props.onDateChange]);

    const onViewChange = React.useCallback((schedulerData: SchedulerData, view: any) => {
        const foundView = availableViews.find(v => v.viewType === view.viewType);
        if (foundView) {
            setSchedulerView(foundView.name);
        }
    }, [setSchedulerView, availableViews]);
    const onSelectDate = React.useCallback((schedulerData: SchedulerData, date: string) => {
        setSchedulerDate(date);
    }, [setSchedulerDate]);

    const eventClicked = React.useCallback((schedulerData: SchedulerData, event: any) => {
        //alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    }, []);

    return (
        <div
            ref={parentRef}
            style={{ width: "100%" }}
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
                />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
});

export default SchedulerControl;