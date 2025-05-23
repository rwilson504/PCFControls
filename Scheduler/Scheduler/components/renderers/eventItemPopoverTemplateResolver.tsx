import * as React from "react";
import { Col, Row } from "antd";
import { SchedulerData, EventItem } from "react-big-schedule";
import { ExtendedSchedulerData, Event } from "../../types";
import { Dayjs } from "dayjs";

export function eventItemPopoverTemplateResolver(
    schedulerData: SchedulerData<EventItem>,
    eventItem: EventItem,
    title: string,
    start: Dayjs, // dayjs instance
    end: Dayjs,   // dayjs instance
    statusColor: string,
    subtitleGetter?: (schedulerData: SchedulerData<EventItem>, eventItem: EventItem) => string,
    viewEventClick?: (schedulerData: SchedulerData<EventItem>, eventItem: EventItem) => void,
    viewEventText?: string,
    viewEvent2Click?: (schedulerData: SchedulerData<EventItem>, eventItem: EventItem) => void,
    viewEvent2Text?: string
): React.ReactNode {
    const { config } = schedulerData as ExtendedSchedulerData;
    const eventItemExtended = eventItem as Event;
    const subtitle = subtitleGetter ? subtitleGetter(schedulerData, eventItem) : null;
    const showViewEvent = viewEventText && viewEventClick && (eventItem.clickable1 === undefined || eventItem.clickable1);
    const showViewEvent2 = viewEvent2Text && viewEvent2Click && (eventItem.clickable2 === undefined || eventItem.clickable2);

    const renderViewEvent = (text: string, clickHandler: (schedulerData: SchedulerData<EventItem>, eventItem: EventItem) => void, marginLeft = 0) => (        
        <button
            className="header2-text txt-btn-dis"
            type="button"
            style={{ color: "#108EE9", cursor: "pointer", marginLeft: `${marginLeft}px` }}
            onClick={() => clickHandler(schedulerData, eventItem)}
        >
            {text}
        </button>
    );

    // Ensure start and end are dayjs instances
    let startValue = start;
    let endValue = end;
    if (typeof start === "string") {
        startValue = schedulerData.localeDayjs(new Date(start));
    }
    if (typeof end === "string") {
        endValue = schedulerData.localeDayjs(new Date(end));
    }

    return (
        <div style={{ width: config.eventItemPopoverWidth }}>
            <Row align="middle">
                {config.eventItemPopoverShowColor && (
                    <Col span={2}>
                        <div className="status-dot" style={{ backgroundColor: statusColor }} />
                    </Col>
                )}
                <Col span={22} className="overflow-text">
                    <span className="header2-text" title={title}>
                        {title}
                    </span>
                </Col>
            </Row>
            {subtitle && (
                <Row align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22} className="overflow-text">
                        <span className="header2-text" title={subtitle}>
                            {subtitle}
                        </span>
                    </Col>
                </Row>
            )}
            <Row align="middle">
                <Col span={2}>
                    <div />
                </Col>
                <Col span={22}>
                    <span className="header1-text">{startValue.format("HH:mm")}</span>
                    {config.eventItemPopoverDateFormat && (
                        <span className="help-text" style={{ marginLeft: "8px" }}>
                            {startValue.format(config.eventItemPopoverDateFormat)}
                        </span>
                    )}
                    <span className="header2-text" style={{ marginLeft: "8px" }}>
                        -
                    </span>
                    <span className="header1-text" style={{ marginLeft: "8px" }}>
                        {endValue.format("HH:mm")}
                    </span>
                    {config.eventItemPopoverDateFormat && (
                        <span className="help-text" style={{ marginLeft: "8px" }}>
                            {endValue.format(config.eventItemPopoverDateFormat)}
                        </span>
                    )}
                </Col>
            </Row>
            {/* Description section */}
            {eventItemExtended.description && (
                <Row align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22} className="overflow-text">
                        <span className="help-text" title={eventItemExtended.description}>
                            {eventItemExtended.description}
                        </span>
                    </Col>
                </Row>
            )}
            {(showViewEvent || showViewEvent2) && (
                <Row align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        {showViewEvent && renderViewEvent(viewEventText!, viewEventClick!)}
                        {showViewEvent2 && renderViewEvent(viewEvent2Text!, viewEvent2Click!, 16)}
                    </Col>
                </Row>
            )}
        </div>
    );
}
