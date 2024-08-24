import { useEffect } from "react";

export function useSyncPlanInfo({
  ticketTypeId,
  ticketQtyPerPlan,
  seatQtyPerticket,
  logEventPrices,
  ticketNumbers,
  planId,
  setPlanInfo,
}: {
  ticketTypeId: number | null;
  ticketQtyPerPlan: number;
  seatQtyPerticket: number;
  logEventPrices: any[];
  ticketNumbers: string[];
  planId: number;
  setPlanInfo: any;
}) {
  useEffect(() => {
    setPlanInfo({
      ticketTypeId,
      ticketQtyPerPlan,
      seatQtyPerticket,
      logEventPrices,
      ticketNumbers,
      planId,
    });
  }, [
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    logEventPrices,
    ticketNumbers,
  ]);
}
