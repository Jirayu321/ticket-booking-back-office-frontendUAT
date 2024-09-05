import { authAxiosClient } from "../config/axios.config";

export async function getAllEventList() {
  try {
    const response = await authAxiosClient.get("/event-list");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ events ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ events ทั้งหมด";
  }
}

export async function createEvent({
  Event_Name,
  Event_Addr,
  Event_Desc,
  Event_Date,
  Event_Time,
  Event_Status,
  Event_Public,
  Event_Pic_1,
  Event_Pic_2,
  Event_Pic_3,
  Event_Pic_4,
}: {
  Event_Name: string;
  Event_Addr: string;
  Event_Desc: string;
  Event_Date: string;
  Event_Time: string;
  Event_Status: number;
  Event_Public: string;
  Event_Pic_1: string | null; // Expect base64 or file URL
  Event_Pic_2?: string | null; // Optional images
  Event_Pic_3?: string | null;
  Event_Pic_4?: string | null;
}) {
  try {
    const response = await authAxiosClient.post("/event-list", {
      Event_Name,
      Event_Addr,
      Event_Desc,
      Event_Date,
      Event_Time,
      Event_Status,
      Event_Public,
      Event_Pic_1, // Include image fields
      Event_Pic_2,
      Event_Pic_3,
      Event_Pic_4,
    });

    if (!(response.status === 201 || response.status === 200))
      throw new Error("สร้าง event ล้มเหลว");

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้าง event";
  }
}

export async function getEventById(eventId: number) {
  try {
    const response = await authAxiosClient.get(`/event-list/${eventId}`);

    if (response.status !== 200) throw "";

    return response.data.event;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงข้อมูล event";
  }
}

export async function updateEventById(eventId: number, newValue: any) {
  try {
    const response = await authAxiosClient.patch(`/event-list/${eventId}`, {
      ...newValue,
      // Event_Pic_1: newValue.Event_Pic_1 || null, // Add image fields
      // Event_Pic_2: newValue.Event_Pic_2 || null,
      // Event_Pic_3: newValue.Event_Pic_3 || null,
      // Event_Pic_4: newValue.Event_Pic_4 || null,
    });

    if (response.status !== 200) throw "";
  } catch (error: any) {
    throw "ล้มเหลวระหว่างอัพเดทข้อมูล event";
  }
}
