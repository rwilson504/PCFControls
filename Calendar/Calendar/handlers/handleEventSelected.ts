import { IEvent } from "../types";

export function handleEventSelected(
  isEventSelectable: boolean,
  onClickSelectedRecord: (id: string) => void,
  pcfContext: any
) {
  return (event: IEvent) => {
    if (!isEventSelectable) {
      return;
    }

    const eventId = event.id as string;
    onClickSelectedRecord(eventId);

    if (pcfContext.mode.allocatedHeight === -1) {
      pcfContext.navigation.openForm({
        entityId: eventId,
        entityName: pcfContext.parameters.calendarDataSet.getTargetEntityType(),
        openInNewWindow: false,
      });
    }
  };
}
