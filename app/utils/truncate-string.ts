export default function (s: string, maxLength: number = 30): string {
  if (s.length <= maxLength) return s;
  return s.slice(0, maxLength - 1) + "…";
}
