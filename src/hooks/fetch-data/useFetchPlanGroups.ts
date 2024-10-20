import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllPlanGroups } from "../../services/plan-group.service";
// import { getAllTicketNoPerPlan } from "../../services/ticket-no-per-plan.service";
import { getAllTicketNoPerPlanfromViwe } from "../../services/ticket-no-per-plan.service";
import { getAllPlans, getAllPlan_TicketNo2 } from "../../services/plan.service";

export function useFetchPlanGroups() {
  const query = useQuery({
    queryKey: ["get all plan groups"],
    queryFn: async () => {
      try {
        const { planGroups } = await getAllPlanGroups();
        const ticketNoPerPlans = await getAllTicketNoPerPlanfromViwe();
        const allPlans = await getAllPlans();
        const allPlan_TicketNo = await getAllPlan_TicketNo2();

        const data = {
          planGroups: planGroups,
          getAllPlans: allPlans,
          ticketNoPerPlans: ticketNoPerPlans,
          allPlan_TicketNo: allPlan_TicketNo.plansTicketNo,
        };
        return data || [];
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
  });
  return query;
}
