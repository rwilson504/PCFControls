// No transformation, just set the view from the event
export function handleOnView(setCalendarView: (view: string) => void) {
  return (view: string) => {
    setCalendarView(view);
  };
}
