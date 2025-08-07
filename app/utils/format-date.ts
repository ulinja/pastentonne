export default function (date: Date, showWeekday: boolean = true): string {
  const format = Intl.DateTimeFormat("en-GB", {
    weekday: showWeekday ? "short" : undefined,
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return format.format(date);
}
