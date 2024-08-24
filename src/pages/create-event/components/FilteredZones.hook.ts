import { useEffect } from "react";

const DELAY = 2000;

export function useSyncTicketQuantityPerPlan(
  ticketQtyPerPlan: {
    zone: any | null;
    ticketQty: number;
  },
  handleInputChange: any
) {
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (!ticketQtyPerPlan.zone) return;
      console.log(ticketQtyPerPlan.zone)
      handleInputChange(
        ticketQtyPerPlan.zone.Plan_id,
        "seatCount",
        ticketQtyPerPlan.ticketQty
      );
    }, DELAY);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [ticketQtyPerPlan.zone, ticketQtyPerPlan.ticketQty]);
}
