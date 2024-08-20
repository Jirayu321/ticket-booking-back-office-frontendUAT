import { useEffect } from "react";
import { useEditZonePriceStore } from "./useEditZonePriceStore";

export function useSyncPlanGroup(viewEventStocks: any[]) {
  const { setSelectedPlanGroupId } = useEditZonePriceStore();
  useEffect(() => {
    if (viewEventStocks && viewEventStocks.length > 0) {
      setSelectedPlanGroupId(viewEventStocks[0].PlanGroup_Id);
    }
  }, [viewEventStocks]);
}
