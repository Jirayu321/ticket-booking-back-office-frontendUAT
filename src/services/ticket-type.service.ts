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

export async function getTicketTypeNameById(ticketTypeId: number) {
  try {
    // Fetch all ticket types
    const ticketTypesResponse = await getAllTicketTypes();

    // Access the array inside the 'ticketTypes' property
    const ticketTypes = ticketTypesResponse.ticketTypes;

    // Check if ticketTypes is an array
    if (!Array.isArray(ticketTypes)) {
      throw new Error("Invalid data format: expected an array");
    }

    // Find the ticket type by its ID (ensure the ID types match)
    const ticketType = ticketTypes.find(
      (type: { Ticket_Type_Id: number | string }) => type.Ticket_Type_Id == ticketTypeId // Use loose equality to handle string/number mismatch
    );

    // If the ticket type is found, return its name, otherwise return a default fallback
    return ticketType ? ticketType.Ticket_Type_Name : "ประเภทบัตร"; // Fallback if not found
  } catch (error: any) {
    console.error("Error fetching ticket type name by ID:", error);
    throw "ล้มเหลวในการดึงชื่อประเภทตั๋วตาม ID"; // Error handling
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


export async function updateTicketType({
  Ticket_Type_Id,
  Ticket_Type_Name,
  Ticket_Type_Unit,
  Ticket_Type_Cal,
}: {
  Ticket_Type_Id: number;
  Ticket_Type_Name: string;
  Ticket_Type_Unit: string;
  Ticket_Type_Cal: string;
}) {
  try {
    const response = await authAxiosClient.patch(`/ticket-type/${Ticket_Type_Id}`, {
      Ticket_Type_Name,
      Ticket_Type_Unit,
      Ticket_Type_Cal,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update ticket type");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างอัปเดตประเภทบัตร");
  }
}

// Function to delete a ticket type
export async function deleteTicketType(Ticket_Type_Id: number) {
  try {
    const response = await authAxiosClient.delete(`/ticket-type/${Ticket_Type_Id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete ticket type");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างลบประเภทตั๋ว");
  }
}