import dayjs from "dayjs";
import { Resource, Event, DemoDataType } from "../types/schedulerTypes";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDemoData(): DemoDataType {
    // Generate 10 resources
    const resources: Resource[] = [];
    for (let i = 0; i < 10; i++) {
        resources.push({
            id: `r${i}`,
            name: `Resource${i}`,
            etn: "demo_resource",
            ...(i === 0 ? { groupOnly: true } : {}),
            ...(i > 0 ? { parentId: `r${Math.floor((i - 1) / 2)}` } : {}),
        });
    }

    const events: Event[] = [];
    const today = dayjs().startOf("day");
    let eventId = 1;

    // Generate events for the last 2 weeks and next month, randomly distributed
    for (let r = 1; r < resources.length; r++) {
        // Each resource gets 6-10 events
        const numEvents = getRandomInt(6, 10);
        for (let e = 0; e < numEvents; e++) {
            // Random day offset: -14 (2 weeks ago) to +29 (next month)
            const dayOffset = getRandomInt(-14, 29);
            // Random start hour between 8 and 13
            const startHour = getRandomInt(8, 13);
            // Random duration between 2 and 8 hours
            const duration = getRandomInt(2, 8);

            const start = today.add(dayOffset, "day").hour(startHour).minute(0).second(0);
            const end = start.add(duration, "hour");

            events.push({
                id: eventId++,
                eventId: `event${eventId}`,
                resourceId: resources[r].id,
                etn: "demo_event",
                start: start.format("YYYY-MM-DD HH:mm:ss"),
                end: end.format("YYYY-MM-DD HH:mm:ss"),
                title: `Event ${eventId} for ${resources[r].name}`,
                bgColor: r % 2 === 0 ? "#D9D9D9" : r % 3 === 0 ? "#FA9E95" : undefined,
            });
        }
    }

    return { resources, events };
}