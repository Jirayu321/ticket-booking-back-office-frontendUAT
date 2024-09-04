import { getOnlyNumber } from "../../lib/util";
import { TicketNoOption } from "./type";

export function getStartNumber(
  ticketNumber: string,
  option: TicketNoOption
): number | null {
  if (option === "2") return Number(ticketNumber);
  if (option === "4") return getOnlyNumber(ticketNumber);
  return null;
}
