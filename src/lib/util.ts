const BC_YEAR = 543;

export function formatThaiDate({
  date,
  option = "date",
}: {
  date: string;
  option: "date" | "datetime";
}) {
  const newDate = new Date(formatISOToLocalTime(date));
  if (option === "date") {
    return `${newDate.getDate().toString().padStart(2, "0")}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${newDate.getFullYear() + BC_YEAR}`;
  }

  return `${newDate.getDate().toString().padStart(2, "0")}/${(
    newDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${newDate.getFullYear() + BC_YEAR} ${newDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`;
}

export function formatISOToLocalTime(isoString: string) {
  const date = new Date(isoString);
  const thaiDate = new Date(date.toLocaleString("en-US"));
  return thaiDate.toISOString().slice(0, 16);
}

export function convertLocalTimeToISO(localTimeString: string) {
  return new Date(localTimeString).toISOString();
}

export function sortTicketNo(tn1: any, tn2: any) {
  if (tn1 === tn2) {
    return 0;
  }
  const tn1Match = tn1.Ticket_No.match(/\d+/);
  const tn1Num = tn1Match ? parseInt(tn1Match[0]) : 0;

  const tn2Match = tn2.Ticket_No.match(/\d+/);
  const tn2Num = tn2Match ? parseInt(tn2Match[0]) : 0;
  return tn1Num - tn2Num;
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
