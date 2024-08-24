import { useEffect } from "react";

export function useSyncPlanInfo({
  ticketTypeId,
  ticketQtyPerPlan,
  seatQtyPerticket,
  logEventPrices,
  ticketNumbers,
  setPlanInfo,
}: {
  ticketTypeId: number | null;
  ticketQtyPerPlan: number;
  seatQtyPerticket: number;
  logEventPrices: any[];
  ticketNumbers: string[];
  setPlanInfo: any;
}) {
  useEffect(() => {
    setPlanInfo({
      ticketTypeId,
      ticketQtyPerPlan,
      seatQtyPerticket,
      logEventPrices,
      ticketNumbers,
    });
  }, [
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    logEventPrices,
    ticketNumbers,
  ]);
}
