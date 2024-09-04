import { useEffect } from "react";

export function useUpdateTicketNumbers({
  startNumber,
  prefix,
  ticketNoOption,
  setPrefix,
  setTempTicketNumbers,
}: {
  startNumber: number | null;
  prefix: string;
  ticketNoOption: string;
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
        setPrefix("โต๊ะ");
        setTempTicketNumbers((prev: any[]) => {
          return prev.map((tnp, index) => {
            return {
              ...tnp,
              Ticket_No: `${prefix} ${Number(startNumber) + index}`,
            };
          });
        });
        break;
      case "4":
        setTempTicketNumbers((prev: any[]) => {
          return prev.map((tnp, index) => {
            return {
              ...tnp,
              Ticket_No: `${prefix}${Number(startNumber) + index}`,
            };
          });
        });
        break;
      case "5":
        setTempTicketNumbers((prev: any[]) => {
          return prev.map((tnp) => {
            return {
              ...tnp,
              Ticket_No: "",
            };
          });
        });

        break;
      default:
        break;
    }
  }, [startNumber, prefix, ticketNoOption]);
}
