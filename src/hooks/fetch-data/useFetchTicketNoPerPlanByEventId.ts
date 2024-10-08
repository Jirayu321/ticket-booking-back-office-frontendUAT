import { useQuery } from "@tanstack/react-query";
import { getAllTicketNoPerPlanByEventId } from "../../services/ticket-no-per-plan.service";

export function useFetchTicketNoPerPlanByEventId({
  // eventId,
  planId,
  planGroupId,
}: {
  // eventId: number;
  planId: number;
  planGroupId: number;
}) {
  const query = useQuery({
    queryKey: [
      "fetch ticket no per plan by event id",
      // eventId,
      planId,
      planGroupId,
    ],
    enabled: Boolean( planId && planGroupId),
    queryFn: async () => {
      return (
        (await getAllTicketNoPerPlanByEventId({
          // eventId,
          planId,
          planGroupId,
        })) ?? null
      );
    },
  });
  return query;
}
