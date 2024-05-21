export function getDates(
  i: number,
  period: string,
  startDate: string | number | Date
) {
  const start = new Date(startDate);

  const addPeriod = {
    D: (date: Date, value: number) => date.setDate(date.getDate() + value),
    W: (date: Date, value: number) => date.setDate(date.getDate() + value * 7),
    M: (date: Date, value: number) => date.setMonth(date.getMonth() + value),
  }[period];

  if (!addPeriod) {
    throw new Error(`Invalid period: ${period}`);
  }

  const date = new Date(start);
  addPeriod(date, i);

  return date;
}
