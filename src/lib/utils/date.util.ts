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

export function formatDate(date: string) {
  try {
    const d = new Date(date);
    const thaiDate = new Date(
      d.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    const day = thaiDate.getDate();
    const month = thaiDate.toLocaleString("th-TH", { month: "long" });
    const year = thaiDate.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  } catch {
    return "";
  }
}

export function formatTime(time: string) {
  try {
    const t = new Date(time);
    const thaiTime = new Date(
      t.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    thaiTime.setHours(thaiTime.getHours() - 7);
    const hour = String(thaiTime.getHours()).padStart(2, "0");
    const minute = String(thaiTime.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  } catch {
    return "";
  }
}

export function getStartDate(date: string, time: string) {
  try {
    const d = new Date(date);
    const t = new Date(time);
    d.setHours(t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds());
    return d.toISOString();
  } catch {
    return "";
  }
}
