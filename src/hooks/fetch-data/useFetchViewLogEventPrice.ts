import { useQuery } from "@tanstack/react-query";
import { getViewLogEventPrice } from "../../services/view-log-event-price.service";

export function useFetchViewLogEventPrice({
  eventId,
  planId,
  planGroupId,
}: {
  eventId: number;
  planId: number;
  planGroupId: number;
}) {
  const query = useQuery({
    queryKey: ["fetch view log event price", eventId, planId, planGroupId],
    enabled: Boolean(eventId && planId && planGroupId),
    queryFn: async () => {
      return (
        (await getViewLogEventPrice({ eventId, planId, planGroupId })) ?? null
      );
    },
  });
  return query;
}
