export default function (date: Date): string {
  const format = Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return format.format(date);
}
