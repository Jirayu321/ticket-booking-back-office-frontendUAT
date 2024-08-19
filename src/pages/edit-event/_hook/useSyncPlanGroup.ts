import { useEffect } from "react";
import { useEditZonePriceStore } from "./useEditZonePriceStore";

export function useSyncPlanGroup(viewEventStocks: any[]) {
  const { setSelectedPlanGroupName } = useEditZonePriceStore();
  useEffect(() => {
    if (viewEventStocks && viewEventStocks.length > 0) {
      setSelectedPlanGroupName(viewEventStocks[0].PlanGroup_Name);
    }
  }, [viewEventStocks]);
}
