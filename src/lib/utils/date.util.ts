const YEAR_DIFFERENCE = 543;

export function convertISOToBuddhistDate(isoString: string) {
  const [_, __, currentYear] = new Date()
    .toLocaleDateString("th-TH")
    .split("/");
  const [fulldate, time] = isoString.split("T");
  const [year, month, date] = fulldate.split("-");
  const convertedYear = Number(year) + YEAR_DIFFERENCE;

  return `${
    convertedYear === Number(currentYear) ? currentYear : year
  }-${month}-${date}T${time}`;
}
