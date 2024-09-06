export function convertISOToBuddhistDate(isoString: string) {
  const [_, __, currentYear] = new Date()
    .toLocaleDateString("th-TH")
    .split("/");
  const [fulldate, time] = isoString.split("T");
  const [year, month, date] = fulldate.split("-");

  return `${
    Number(year) >= Number(currentYear) ? year : currentYear
  }-${month}-${date}T${time}`;
}
