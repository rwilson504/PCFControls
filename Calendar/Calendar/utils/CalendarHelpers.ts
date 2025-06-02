import { IInputs } from "../generated/ManifestTypes";
import * as moment from "moment";
import { View, ViewsProps, DateLocalizer, ViewProps } from "react-big-calendar";
import * as lcid from "lcid";
import CustomWorkWeek from "../components/WorkWeek";
import * as Constants from "./Constants"
import { Resource } from "../types";

//format the date/time so that it can be passed as a parameter to a Dynamics form
export function formatDateAsParameterString(date: Date) {
  //months are zero index so don't forget to add one :)
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}

export function getCalendarView(
  calendarViews: ViewProps<Event, Resource>,
  viewName: string
): View {
  const calView = Object.keys(calendarViews).find(
    (x: string) => x === viewName.toLowerCase()
  );
  return calView ? (calView as View) : (Object.keys(calendarViews)[0] as View);
}

export function getCalendarViews(
  pcfContext: ComponentFramework.Context<IInputs>,
  localizer: DateLocalizer
): ViewsProps<Event, Resource> {
  const viewList = pcfContext.parameters.calendarAvailableViews?.raw || "month";
  const validViews = viewList
    .split(",")
    .filter((x) => Constants.CALENDAR_VIEWS.indexOf(x.trim()) !== -1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedViews: any = {};
  if (validViews.length < 1) {
    selectedViews.week = true;
  } else {
    validViews.forEach((view: string) => {
      if (view === "work_week") {
        selectedViews.work_week = CustomWorkWeek;
        selectedViews.work_week.localizer = localizer;
        selectedViews.work_week.includedDays =
          getWorkWeekIncludedDays(pcfContext);
      } else {
        selectedViews[view] = true;
      }
    });
  }
  return selectedViews;
}

export function getWorkWeekIncludedDays(
  pcfContext: ComponentFramework.Context<IInputs>
): number[] {
  if (
    pcfContext.parameters.calendarWorkWeekDays &&
    pcfContext.parameters.calendarWorkWeekDays.raw
  ) {
    return pcfContext.parameters.calendarWorkWeekDays.raw
      .split(",")
      .map((x) => {
        return +x - 1;
      });
  } else {
    return [1, 2, 3, 4, 5];
  }
}

export function getCurrentRange(
  date: Date,
  view: string,
  culture: string
): { start: Date; end: Date } {
  let start = moment().toDate(),
    end = moment().toDate();
  if (view === "day") {
    start = moment(date).startOf("day").toDate();
    end = moment(date).endOf("day").toDate();
  } else if (view === "week") {
    start = moment(date).startOf("week").toDate();
    end = moment(date).endOf("week").toDate();
  } else if (view === "work_week") {
    start = moment(date).weekday(1).toDate();
    end = moment(date).weekday(5).toDate();
  } else if (view === "month") {
    start = moment(date).startOf("month").startOf("week").toDate();
    end = moment(date).endOf("month").endOf("week").toDate();
  } else if (view === "agenda") {
    start = moment(date).startOf("day").toDate();
    end = moment(date).endOf("day").add(1, "month").toDate();
  }
  return { start, end };
}

export function getISOLanguage(
  pcfContext: ComponentFramework.Context<IInputs>
): string {
  //look for a language setting coming in from the parameters.
  //if nothing was entered use an empty string which will default to en
  let lang = pcfContext.parameters.calendarLanguage?.raw || "";

  //if this is a model app and a language was not added as an input then user the current users
  // language settings.
  if (!lang && pcfContext.mode.allocatedHeight === -1) {
    lang = lcid.from(pcfContext.userSettings.languageId);
    return lang.substring(0, lang.indexOf("_"));
  }

  return lang;
}
