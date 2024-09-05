import { useEffect } from "react";

export function useSyncPlanInfo({
  ticketTypeId,
  ticketQtyPerPlan,
  seatQtyPerticket,
  logEventPrices,
  ticketNumbers,
  planId,
  Plan_Pic,  // Added Plan_Pic
  setPlanInfo,
}: {
  ticketTypeId: number | null;
  ticketQtyPerPlan: number;
  seatQtyPerticket: number;
  logEventPrices: any[];
  ticketNumbers: string[];
  planId: number;
  Plan_Pic: string | null;  // Plan_Pic is a string URL or null
  setPlanInfo: (info: any) => void;
}) {
  useEffect(() => {
    setPlanInfo({
      ticketTypeId,
      ticketQtyPerPlan,
      seatQtyPerticket,
      logEventPrices,
      ticketNumbers,
      planId,
      Plan_Pic,  // Add Plan_Pic to the state
    });
  }, [
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    logEventPrices,
    ticketNumbers,
    Plan_Pic,  // Include Plan_Pic in the dependencies array
  ]);
}
