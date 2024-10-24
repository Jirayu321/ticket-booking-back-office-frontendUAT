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
  Ticket_Type_Id: number | null; // เปลี่ยนให้รองรับ null
  Ticket_Qty: number;
  Ticket_Qty_Per: number;
  STC_Total: number;
  Ticket_Qty_Buy: number | null; // เปลี่ยนให้รองรับ null
  Ticket_Qty_Balance: number | null; // เปลี่ยนให้รองรับ null
  STC_Total_Balance: number | null; // เปลี่ยนให้รองรับ null
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

    if (response.status !== 200) {
      console.error("Unexpected response:", response);
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      throw new Error("ล้มเหลวระหว่างสร้าง event stock: " + error.response.data);
    } else {
      console.error("Error message:", error.message);
      throw new Error("ล้มเหลวระหว่างสร้าง event stock: " + error.message);
    }
  }
}

// ================ READ ================

export async function getEventStock() {
  try {
    const response = await authAxiosClient.get("/event-stock");

    if (response.status !== 200) {
      throw new Error("Failed to fetch event stock");
    }

    return response.data.eventStocks || [];
  } catch (error) {
    console.error("Error fetching event stock:", error);
    return [];
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
