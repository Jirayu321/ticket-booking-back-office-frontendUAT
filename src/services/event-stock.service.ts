import { authAxiosClient } from "../config/axios.config";

export async function createEventStock({
  Event_Id,
  PlanGroup_Id,
  Plan_Id,
  Ticket_Type_Id,
  Ticket_Qty,
  Ticket_Qty_Per,
  STC_Total,
  Ticket_Qty_Buy,
  Ticket_Qty_Balance,
  STC_Total_Balance,
  Created_By,
}: {
  Event_Id: number;
  PlanGroup_Id: number;
  Plan_Id: number;
  Ticket_Type_Id: number;
  Ticket_Qty: number;
  Ticket_Qty_Per: number;
  STC_Total: number;
  Ticket_Qty_Buy: number;
  Ticket_Qty_Balance: number;
  STC_Total_Balance: number;
  Created_By: string;
}) {
  try {
    const response = await authAxiosClient.post("/event-stock", {
      Event_Id,
      PlanGroup_Id,
      Plan_Id,
      Ticket_Type_Id,
      Ticket_Qty,
      Ticket_Qty_Per,
      STC_Total,
      Ticket_Qty_Buy,
      Ticket_Qty_Balance,
      STC_Total_Balance,
      Created_By,
    });

    if (response.status !== 200) throw "";
  } catch (error) {
    throw "ล้มเหลวระหว่างสร้าง event stock";
  }
}
