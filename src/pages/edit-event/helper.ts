import { getOnlyNumber, isInTimeRange } from "../../lib/util";
import { TicketNoOption } from "./type";

export function getStartNumber(
  ticketNumber: string,
  option: TicketNoOption
): number | null {
  if (option === "2") return Number(ticketNumber);
  if (option === "4") return getOnlyNumber(ticketNumber);
  return null;
}

export function getPrefix(option: TicketNoOption): string {
  if (option === "3") return "โต๊ะ";
  return "";
}

export function validateLogEventPrices(logEventPrices: any[]): {
  message: string;
  isValid: boolean;
} {
  let message: string = "",
    isValid: boolean = true;

  const doesHaveOverlappedTime = logEventPrices
    .map((lep: any) => {
      const isOverlapped = logEventPrices.some((lep2: any) => {
        if (lep.id === lep2.id) return false;
        return (
          isInTimeRange({
            targetDate: new Date(lep.Start_Datetime),
            from: new Date(lep2.Start_Datetime),
            to: new Date(lep2.End_Datetime),
          }) ||
          isInTimeRange({
            targetDate: lep.End_Datetime,
            from: new Date(lep2.Start_Datetime),
            to: new Date(lep2.End_Datetime),
          })
        );
      });
      return isOverlapped;
    })
    .includes(true);

  if (doesHaveOverlappedTime) {
    message = "ระยะเวลาที่เลือกมีการซ้อนทับกับราคาอื่นๆ";
    isValid = false;
  }

  return { message, isValid };
}
