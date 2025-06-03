import { useState, useEffect } from "react";
import * as Color from "color";
import isHexColor from "is-hexcolor";
import * as CalendarUtils from "../utils";
import cssVars from "css-vars-ponyfill";
import { IInputs } from "../generated/ManifestTypes";

export function useCalendarColors(pcfContext: ComponentFramework.Context<IInputs>, eventHeaderFormat: string) {

  const [eventDefaultBackgroundColor, setEventDefaultBackgroundColor] = useState<Color>(
    Color(
      isHexColor(pcfContext.parameters.eventDefaultColor?.raw || "")
        ? (pcfContext.parameters.eventDefaultColor.raw as string)
        : CalendarUtils.DEFAULT_EVENT_COLOR
    )
  );
  
  const [calendarTodayBackgroundColor, setCalendarTodayBackgroundColor] = useState<Color>(
    Color(
      isHexColor(pcfContext.parameters.calendarTodayBackgroundColor?.raw || "")
        ? (pcfContext.parameters.calendarTodayBackgroundColor.raw as string)
        : CalendarUtils.DEFAULT_TODAY_BACKGROUND_COLOR
    )
  );

  const [calendarTextColor, setCalendarTextColor] = useState<Color>(
    Color(
      isHexColor(pcfContext.parameters.calendarTextColor?.raw || "")
        ? (pcfContext.parameters.calendarTextColor.raw as string)
        : CalendarUtils.DEFAULT_TEXT_COLOR
    )
  );

  const [calendarBorderColor, setCalendarBorderColor] = useState<Color>(
    Color(
      isHexColor(pcfContext.parameters.calendarBorderColor?.raw || "")
        ? (pcfContext.parameters.calendarBorderColor.raw as string)
        : CalendarUtils.DEFAULT_BORDER_COLOR
    )
  );

  const [calendarTimeBarBackgroundColor, setCalendarTimeBarBackgroundColor] = useState<Color>(
    Color(
      isHexColor(pcfContext.parameters.calendarTimeBarBackgroundColor?.raw || "")
        ? (pcfContext.parameters.calendarTimeBarBackgroundColor.raw as string)
        : CalendarUtils.DEFAULT_TIMEBAR_BACKGROUND_COLOR
    )
  );

  const [weekendColor, setWeekendColor] = useState<string>(
    isHexColor(pcfContext.parameters.weekendBackgroundColor?.raw || "")
      ? pcfContext.parameters.weekendBackgroundColor.raw!
      : CalendarUtils.DEFAULT_WEEKEND_BACKGROUND_COLOR
  );

  useEffect(() => {
    setEventDefaultBackgroundColor(
      Color(
        isHexColor(pcfContext.parameters.eventDefaultColor?.raw || "")
          ? (pcfContext.parameters.eventDefaultColor.raw as string)
          : CalendarUtils.DEFAULT_EVENT_COLOR
      )
    );
  }, [pcfContext.parameters.eventDefaultColor?.raw]);

  useEffect(() => {
    setCalendarTodayBackgroundColor(
      Color(
        isHexColor(pcfContext.parameters.calendarTodayBackgroundColor?.raw || "")
          ? (pcfContext.parameters.calendarTodayBackgroundColor.raw as string)
          : CalendarUtils.DEFAULT_TODAY_BACKGROUND_COLOR
      )
    );
  }, [pcfContext.parameters.calendarTodayBackgroundColor?.raw]);

  useEffect(() => {
    setCalendarTextColor(
      Color(
        isHexColor(pcfContext.parameters.calendarTextColor?.raw || "")
          ? (pcfContext.parameters.calendarTextColor.raw as string)
          : CalendarUtils.DEFAULT_TEXT_COLOR
      )
    );
  }, [pcfContext.parameters.calendarTextColor?.raw]);

  useEffect(() => {
    setCalendarBorderColor(
      Color(
        isHexColor(pcfContext.parameters.calendarBorderColor?.raw || "")
          ? (pcfContext.parameters.calendarBorderColor.raw as string)
          : CalendarUtils.DEFAULT_BORDER_COLOR
      )
    );
  }, [pcfContext.parameters.calendarBorderColor?.raw]);

  useEffect(() => {
    setCalendarTimeBarBackgroundColor(
      Color(
        isHexColor(pcfContext.parameters.calendarTimeBarBackgroundColor?.raw || "")
          ? (pcfContext.parameters.calendarTimeBarBackgroundColor.raw as string)
          : CalendarUtils.DEFAULT_TIMEBAR_BACKGROUND_COLOR
      )
    );
  }, [pcfContext.parameters.calendarTimeBarBackgroundColor?.raw]);

  useEffect(() => {
    const color = isHexColor(pcfContext.parameters.weekendBackgroundColor?.raw || "")
      ? pcfContext.parameters.weekendBackgroundColor.raw!
      : CalendarUtils.DEFAULT_WEEKEND_BACKGROUND_COLOR;
    setWeekendColor(color);
  }, [pcfContext.parameters.weekendBackgroundColor?.raw]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--calendar-text-color",
      calendarTextColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-text-color-grayscale",
      calendarTextColor.grayscale().array().toString()
    );
    root.style.setProperty(
      "--calendar-border-color",
      calendarBorderColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-timebar-background-color",
      calendarTimeBarBackgroundColor.array().toString()
    );
    root.style.setProperty(
      "--calendar-show-more-hover",
      calendarTextColor.isDark()
        ? calendarTextColor.grayscale().fade(0.8).array().toString()
        : calendarTextColor.grayscale().fade(0.2).array().toString()
    );
    root.style.setProperty(
      "--event-label-display",
      eventHeaderFormat === "1" ? "none" : "flex"
    );
    // Use the imported cssVars ponyfill directly
    cssVars({
      preserveVars: true,
      // Remove watch unless you need live updates
      // watch: true,
      onlyLegacy: false, // Set to true only if you need IE11 support
    });
  }, [
    calendarTextColor,
    calendarBorderColor,
    calendarTimeBarBackgroundColor,
    eventHeaderFormat,
  ]);

  return {
    eventDefaultBackgroundColor,
    calendarTodayBackgroundColor,
    calendarTextColor,
    calendarBorderColor,
    calendarTimeBarBackgroundColor,
    weekendColor,
  };
}
