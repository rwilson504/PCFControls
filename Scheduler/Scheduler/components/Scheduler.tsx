import * as React from "react";
import { SchedulerData, ViewType } from "react-big-schedule";
import SchedulerWrapper from "./SchedulerWrapper";
import { usePcfContext } from "../services/PcfContext";
import "react-big-schedule/dist/css/style.css";
// import * as antdLocale from "antd/locale/en_US";
import dayjsLocale from "dayjs/locale/en";
import { ISchedulerControlProps } from "../types/schedulerTypes";
import { generateDemoData } from "../utils/demoData";

const demoData = generateDemoData();

const SchedulerControl: React.FC<ISchedulerControlProps> = React.memo((props) => {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const [parentReady, setParentReady] = React.useState(false);

    React.useLayoutEffect(() => {
        if (parentRef.current) {
            setParentReady(true);
        }
    }, []);

    React.useEffect(() => {
        if (parentRef.current) {
            console.log("Parent ref is ready", parentRef.current);
        } else {
            console.warn("Parent ref is still null");
        }

    }, []);
    const pcfContext = usePcfContext();
    // Initialize SchedulerData
    const [schedulerData, setSchedulerData] = React.useState(() => {
        const sd = new SchedulerData(
            new Date().toISOString().slice(0, 10),
            ViewType.Week,
            false,
            false,
            {
                responsiveByParent: true,
                schedulerWidth: `100%`,
                besidesWidth: 0,
                schedulerContentHeight: "100%",
                eventItemPopoverTrigger: "click",
                //schedulerMaxHeight: pcfContext.height as number
            }
        );
        sd.setSchedulerLocale(dayjsLocale);
        sd.setCalendarPopoverLocale("en_US");
        sd.setResources(demoData.resources);
        sd.setEvents(demoData.events);
        return sd;
    });

    // Handler callbacks
    const handlePrevClick = React.useCallback((sd: SchedulerData) => {
        sd.prev();
        sd.setEvents(demoData.events);
        setSchedulerData(sd);
    }, []);

    const handleNextClick = React.useCallback((sd: SchedulerData) => {
        sd.next();
        sd.setEvents(demoData.events);
        setSchedulerData(sd);
    }, []);

    const handleViewChange = React.useCallback((sd: SchedulerData, view: any) => {
        sd.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        sd.setEvents(demoData.events);
        setSchedulerData(sd);
    }, []);

    const handleSelectDate = React.useCallback((sd: SchedulerData, date: string) => {
        sd.setDate(date);
        sd.setEvents(demoData.events);
        setSchedulerData(sd);
    }, []);

    const handleEventClick = React.useCallback((sd: SchedulerData, event: any) => {
        //alert(`You clicked event: ${event.title}`);
    }, []);

    // Add more handlers as needed...

    return (
        <div ref={parentRef} style={{ width: "100%" }} className="scheduler-container" role="region" aria-label="Scheduler">
            {parentReady && (
                <SchedulerWrapper
                    parentRef={parentRef}
                    schedulerData={schedulerData}
                    prevClick={handlePrevClick}
                    nextClick={handleNextClick}
                    onSelectDate={handleSelectDate}
                    onViewChange={handleViewChange}
                    eventItemClick={handleEventClick}
                // Add more handlers as needed
                />
            )}
        </div>
    );
});

export default SchedulerControl;