import { SwalError } from "./sweetalert";

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

export function doesSomeItemDuplicateInMultipleArrays<T>(arrays: T[]): boolean {
  const filteredArrays = arrays.filter((item) => Boolean(item));
  return new Set(filteredArrays).size !== filteredArrays.length;
}

export function printCanvas(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;

  if (!canvas) {
    SwalError("ไม่สามารถพิมพ์บัตรที่นั่งได้");
    return;
  }

  const dataUrl = canvas.toDataURL("image/png");

  const printWindow = window.open("", "_blank");

  printWindow?.document.write(`
  <html>
    <head>
      <title>Print Canvas</title>
    </head>
    <body>
      <img src="${dataUrl}" style="width:100%; height:auto;"/>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
  </html>
`);

  printWindow?.document.close();
}

export function getOnlyNumber(value: string): number {
  return value.replace(/[^0-9]/g, "");
}

export function isInTimeRange({
  targetDate,
  from,
  to,
}: {
  targetDate: Date;
  from: Date;
  to: Date;
}) {
  return targetDate >= from && targetDate <= to;
}
