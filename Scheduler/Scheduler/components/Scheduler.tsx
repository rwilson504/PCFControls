import * as React from "react";
import { ViewType, SchedulerData } from "react-big-schedule";
import SchedulerWrapper from "./SchedulerWrapper";
import { usePcfContext } from "../services/PcfContext";
import "react-big-schedule/dist/css/style.css";
import { ISchedulerControlProps } from "../types/schedulerTypes";
import { SCHEDULER_VIEWS } from "../types/schedulerViews";
import { getCustomDateFunc } from "../services/schedulerBehaviors";
import { DEFAULT_VIEW_NAMES } from "../utils/constants";
import { generateDemoData } from "../utils/demoData";
import { getKeys, getSchedulerData } from "../services/CalendarDataService"; // <-- Use your real data service


const demoData = generateDemoData();

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

const SchedulerControl: React.FC<ISchedulerControlProps> = React.memo(() => {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const pcfContext = usePcfContext();

    const availableViews = React.useMemo(() => {
        const raw = pcfContext.context.parameters.schedulerAvailableViews?.raw as string | undefined;
        const allowed = raw && raw.trim().length > 0
            ? raw.split(",").map(v => v.trim().toLowerCase())
            : DEFAULT_VIEW_NAMES;
        return SCHEDULER_VIEWS.filter(view => allowed.includes(view.name.toLowerCase()));
    }, [pcfContext.context.parameters.schedulerAvailableViews?.raw]);

    const defaultViewType = React.useMemo(() => {
        const raw = pcfContext.context.parameters.schedulerDefaultView?.raw as string | undefined;
        if (!raw) return availableViews[0]?.viewType ?? ViewType.Week;
        const match = availableViews.find(view => view.name.toLowerCase() === raw.trim().toLowerCase());
        return match?.viewType ?? availableViews[0]?.viewType ?? ViewType.Week;
    }, [pcfContext.context.parameters.schedulerDefaultView?.raw, availableViews]);

    React.useEffect(() => {
let isMounted = true;
        async function loadSchedulerData() {
            // Get keys for mapping fields
            const keys = await getKeys(pcfContext.context);
            // Fetch resources and events using those keys
            const { resources, events } = await getSchedulerData(pcfContext.context, keys);

            if (!isMounted) return;

            const sd = new SchedulerData(
                new Date().toISOString().slice(0, 10),
                defaultViewType,
                false,
                false,
                {
                    responsiveByParent: true,
                    schedulerWidth: `100%`,
                    besidesWidth: 0,
                    schedulerContentHeight: "100%",
                    schedulerMaxHeight: pcfContext.height as number,
                    eventItemPopoverTrigger: "click",
                    views: availableViews
                }, { getCustomDateFunc }
            );
            sd.setResources(resources);
            sd.setEvents(events);
            dispatch({ type: "INITIALIZE", payload: sd });
        }

        loadSchedulerData();
        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultViewType, availableViews, pcfContext.height]);

    // Handler callbacks
    const prevClick = React.useCallback((schedulerData: SchedulerData) => {
        schedulerData.prev();
        //schedulerData.setEvents(demoData.events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }, []);

    const nextClick = React.useCallback((schedulerData: SchedulerData) => {
        schedulerData.next();
        //schedulerData.setEvents(demoData.events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }, []);

    const onViewChange = React.useCallback((schedulerData: SchedulerData, view: any) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        //schedulerData.setEvents(demoData.events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }, []);

    const onSelectDate = React.useCallback((schedulerData: SchedulerData, date: string) => {
        schedulerData.setDate(date);
        //schedulerData.setEvents(demoData.events);
        dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }, []);

    const eventClicked = React.useCallback((schedulerData: SchedulerData, event: any) => {
        alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    }, []);

    return (
        <div
            ref={parentRef}
            style={{ width: "400px" }}
            className="scheduler-container"
            role="region"
            aria-label="Scheduler"
        >
            {state.showScheduler && state.schedulerData? (
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