import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllTicketTypes } from "../../services/ticket-type.service";

export function useFetchTicketTypes() {
  const query = useQuery({
    queryKey: ["get all ticket types"],
    queryFn: async () => {
      try {
        const { ticketTypes } = await getAllTicketTypes();
        return ticketTypes || [];
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
  });
  return query;
}
