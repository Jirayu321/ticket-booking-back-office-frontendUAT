import { authAxiosClient } from "../config/axios.config";

export async function createTicketNoPerPlan({
  PlanGroup_Id,
  Plan_Id,
  Line,
  Ticket_No,
  Ticket_No_Option,
}: {
  PlanGroup_Id: number;
  Plan_Id: number;
  Line: number;
  Ticket_No: string;
  Ticket_No_Option: number;
}) {
  try {
    const response = await authAxiosClient.post("/ticket-no-per-plan", {
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
