import { authAxiosClient } from "../config/axios.config";

// ================ CREATE ================
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

// ================ READ ================

export async function getEventStock() {
  try {
    const response = await authAxiosClient.get("/event-stock");

    if (response.status !== 200) {
      throw new Error("Failed to fetch event stock");
    }

    return response.data.eventStocks;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูล event stock");
  }
}

// ================ UPDATE ================

export async function updateEventStock({
  eventId,
  planGroupId,
  planId,
  newValues,
}: {
  eventId: number;
  planGroupId: number;
  planId: number;
  newValues: any;
}) {
  try {
    const response = await authAxiosClient.patch(
      `/event-stock/${eventId}?planGroupId=${planGroupId}&planId=${planId}`,
      newValues
    );

    if (response.status !== 200)
      throw new Error("ล้มเหลวระหว่างอัพเดท event stock");
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างอัพเดท event stock");
  }
}
