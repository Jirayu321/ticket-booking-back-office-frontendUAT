import { authAxiosClient } from "../config/axios.config";

export async function getAllTicketTypes() {
  try {
    const response = await authAxiosClient.get("/ticket-type");

    if (response.status !== 200) throw new Error();

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการประเภทตั๋วทั้งหมด";
  }
}

export async function createTicketType({
  Ticket_Type_Name,
  Ticket_Type_Unit,
  Ticket_Type_Cal,
}: {
  Ticket_Type_Name: string;
  Ticket_Type_Unit: string;
  Ticket_Type_Cal: string;
}) {
  try {
    const response = await authAxiosClient.post("/ticket-type", {
      Ticket_Type_Name,
      Ticket_Type_Unit,
      Ticket_Type_Cal,
    });

    if (response.status !== 200) {
      throw "Failed to create ticket type";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้าง ticket type";
  }
}
