import { useEffect, useState } from "react";
import * as CalendarUtils from "../utils";
import { IInputs } from "../generated/ManifestTypes";

export function useCalendarStepAndTimeslots(pcfContext: ComponentFramework.Context<IInputs>) {
  const [step, setStep] = useState<number>(
    pcfContext.parameters.calendarStep?.raw ?? CalendarUtils.DEFAULT_STEP
  );
  const [timeslots, setTimeslots] = useState<number>(
    pcfContext.parameters.calendarTimeSlots?.raw ?? CalendarUtils.DEFAULT_TIMESLOTS
  );

  useEffect(() => {
    const newStep =
      pcfContext.parameters.calendarStep?.raw ?? CalendarUtils.DEFAULT_STEP;
    const newTimeslots =
      pcfContext.parameters.calendarTimeSlots?.raw ?? CalendarUtils.DEFAULT_TIMESLOTS;
    setStep(newStep);
    setTimeslots(newTimeslots);
  }, [
    pcfContext.parameters.calendarStep?.raw,
    pcfContext.parameters.calendarTimeSlots?.raw,
  ]);

  return { step, timeslots };
}
