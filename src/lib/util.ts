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
  console.log(
    "new Date(localTimeString).toISOString()",
    new Date(localTimeString).toISOString()
  );
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

export function getOnlyNumber(value: string | undefined): number {
  if (!value) return 0;
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

export const selectedColor = "lightblue";

// srock
export const ColumnColorstock = "yellow";
export const Event_StatusColor1 = "#FFA500";
export const Event_StatusColor2 = "#4CAF50";
export const Event_StatusColor3 = "#2196F3";
export const Event_StatusColor13 = "#F44336";
export const Event_StatusColorUnknown = "#9E9E9E";

// seat
export const PrintStatusColor1 = "grey";
export const PrintStatusColor0 = "blue";
export const check_in_statusColor1 = "grey";
export const check_in_statusColor0 = "#28a745";
export const ticketReserveStatusColorR = "silver";
export const ticketReserveStatusColorW = "secondary";

// order
export const paymentStatusBgColor0 = "#28a745";
export const paymentStatusBgColor1 = "#ffc107";
export const paymentStatusBgUnknown = "#f8f9fa";

// event
export const Event_PublicY = "green";
export const Event_PublicN = "#11131A1F";

export const Event_Status1 = "##0094FF";
export const Event_Status2 = "#0B8600";
export const Event_Status3 = "#11131A1F";
export const Event_Status13 = "#C82121";
