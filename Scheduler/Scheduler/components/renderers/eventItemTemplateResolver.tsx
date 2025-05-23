import * as React from "react";
import { SchedulerData, EventItem } from "react-big-schedule";
import Color from "color";

export function eventItemTemplateResolver(
    schedulerData: SchedulerData<EventItem>,
    event: EventItem,
    bgColor: string,
    isStart: boolean,
    isEnd: boolean,
    mustAddCssClass: string,
    mustBeHeight: number,
    agendaMaxEventWidth: number
): React.ReactNode {
    let additionalClass = 'round-all';

    // Use Color to determine if background is dark or light
    let textColor = "#000";
    try {
        if (Color(bgColor).isDark()) {
            textColor = "#fff";
        }
    } catch {
        // fallback if color parsing fails
        textColor = "#000";
    }

    return (
        <div
            key={event.id}
            className={`${mustAddCssClass} ${additionalClass}`}
            style={{ background: bgColor, color: textColor }}            
            aria-label={event.title}
        >
            <span style={{ marginLeft: 10, lineHeight: '22px', fontSize: '12px' }}>{event.title}</span>
        </div>
    );
}
