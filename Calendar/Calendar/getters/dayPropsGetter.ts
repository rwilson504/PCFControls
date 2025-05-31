import { Moment } from "moment";

export function dayPropsGetter(
  date: Date,
  calendarTodayBackgroundColor: any,
  weekendColor: any,
  momentInstance: (input?: any) => Moment
) {
  // Check if the day is today
  if (momentInstance(date).startOf("day").isSame(momentInstance().startOf("day")))
    return {
      style: {
        backgroundColor: calendarTodayBackgroundColor.toString(),
      },
    };
  // Check if the day is a weekend (Saturday or Sunday)
  if (momentInstance(date).day() === 0 || momentInstance(date).day() === 6) {
    return {
      style: {
        backgroundColor: weekendColor.toString(),
      },
    };
  }
  return {};
}
