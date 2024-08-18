import { authAxiosClient } from "../config/axios.config";

export async function createTicketNoPerPlan({
  Event_Id,
  PlanGroup_Id,
  Plan_Id,
  Line,
  Ticket_No,
  Ticket_No_Option,
}: {
  Event_Id: number;
  PlanGroup_Id: number;
  Plan_Id: number;
  Line: number;
  Ticket_No: string;
  Ticket_No_Option: number;
}) {
  try {
    if (!Ticket_No) return;
    const response = await authAxiosClient.post("/ticket-no-per-plan", {
      Event_Id,
      PlanGroup_Id,
      Plan_Id,
      Line,
      Ticket_No,
      Ticket_No_Option,
    });

    if (response.status !== 200) throw new Error();
  } catch (error: any) {
    throw "ล้มเหลวระหว่างเพิ่มเลขตั๋ว";
  }
}
