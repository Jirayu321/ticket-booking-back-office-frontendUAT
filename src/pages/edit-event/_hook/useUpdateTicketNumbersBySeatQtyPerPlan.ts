import { useEffect } from "react";

export function useUpdateTicketNumbersBySeatQtyPerPlan({
  seatQtyPerPlan,
  setTicketNumbers,
}: {
  seatQtyPerPlan: number;
  setTicketNumbers: any;
}) {
  useEffect(() => {
    setTicketNumbers((prev: string[]) => {
      if (!Boolean(prev)) return [];

      const previousLength = prev.length;

      const currentLength = seatQtyPerPlan;

      if (currentLength < previousLength) {
        return prev.slice(0, currentLength);
      } else if (currentLength > previousLength) {
        const newTicketNumbers = Array.from(
          { length: currentLength - previousLength },
          (_) => ({
            Ticket_No: ""
          })
        );

        return [...prev, ...newTicketNumbers];
      } else {
        return prev;
      }
    });
  }, [seatQtyPerPlan]);
}
