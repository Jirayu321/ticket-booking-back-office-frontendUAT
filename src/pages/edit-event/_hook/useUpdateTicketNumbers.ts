import { useEffect } from "react";
import { getStartNumber } from "../helper";

export function useUpdateTicketNumbers({
  startNumber,
  prefix,
  ticketNoOption,
  ticketNumber,
  setStartNumber,
  setPrefix,
  setTempTicketNumbers,
}: {
  startNumber: number | null;
  prefix: string;
  ticketNoOption: string;
  ticketNumber: any;
  setStartNumber: any;
  setPrefix: any;
  setTempTicketNumbers: (value: any) => void;
}) {
  useEffect(() => {
    switch (ticketNoOption) {
      case "1":
        break;
      case "2":
        setTempTicketNumbers((prev: any[]) => {
          return prev.map((tnp, index) => {
            return {
              ...tnp,
              Ticket_No: `${Number(startNumber) + index}`,
            };
          });
        });
        break;
      case "3":
        setStartNumber(getStartNumber(ticketNumber?.Ticket_No, ticketNoOption));
        setPrefix("");
        break;
      case "4":
        setStartNumber(getStartNumber(ticketNumber?.Ticket_No, ticketNoOption));
        setPrefix(ticketNumber?.Prefix);
        break;
      default:
        break;
    }
  }, [startNumber, prefix, ticketNoOption]);
}
