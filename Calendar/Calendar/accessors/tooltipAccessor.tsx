import { IEvent } from "../types/IEvent";

/**
 * Returns a tooltip string for a calendar event.
 * If the event has a description, the tooltip will be:
 *   Title\nDescription
 * Otherwise, just the title.
 */
export function tooltipAccessor(event: IEvent): string {
  if (event.description) {
    // Use a line break for HTML tooltips, or \n for plain text
    return `${event.title}\n${event.description}`;
  }
  return `${event.title}`;
}
