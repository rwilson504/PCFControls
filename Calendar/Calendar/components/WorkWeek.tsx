/*
 * @Author: rwilson504
 * @Date: 2024-12-15 09:17:24
 * @Last Modified by: Rick Wilson
 * @Last Modified time: 2024-12-16 10:53:14
 */

import * as React from "react";
import { useMemo } from "react";
import * as PropTypes from "prop-types";
import Week from 'react-big-calendar/lib/Week'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

export interface CustomWeekViewProps {
  date: Date;
  localizer: {
    add: (date: Date, value: number, unit: string) => Date;
    startOf: (date: Date, unit: string) => Date;
    endOf: (date: Date, unit: string) => Date;
    format: (range: { start: Date; end: Date }, format: string) => string;
    lte: (date1: Date, date2: Date, unit: string) => boolean;
  };
  max?: Date;
  min?: Date;
  scrollToTime?: Date;
  [key: string]: unknown; // Allow additional props
}

export default function CustomWorkWeek({
  date,
  localizer,
  max = localizer.endOf(new Date(), "day"),
  min = localizer.startOf(new Date(), "day"),
  scrollToTime = localizer.startOf(new Date(), "day"),
  ...props
}: CustomWeekViewProps) {
  const currRange = useMemo(
    () => CustomWorkWeek.range(date, { localizer }),
    [date, localizer]
  );

  return (
    <TimeGrid
      eventOffset={15}
      localizer={localizer}
      max={max}
      min={min}
      range={currRange}      
      scrollToTime={scrollToTime}
      enableAutoScroll={true}
      {...props}
    />
  );
}

CustomWorkWeek.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  localizer: PropTypes.object,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  scrollToTime: PropTypes.instanceOf(Date),
};

CustomWorkWeek.range = (
  date: Date,
  { localizer }: { localizer: CustomWeekViewProps["localizer"] }
): Date[] => {
  const range = Week.range(date, {localizer});

  return range.filter((d: Date) => CustomWorkWeek.includedDays.includes(d.getDay()));
};

CustomWorkWeek.includedDays = [] as number[];
CustomWorkWeek.navigate = Week.navigate;

CustomWorkWeek.title = (
  date: Date,
  { localizer }: { localizer: CustomWeekViewProps["localizer"] }
): string => {
  const [start, ...rest] = CustomWorkWeek.range(date, { localizer });
  return localizer.format({ start, end: rest.pop()! }, "dayRangeHeaderFormat");
};
