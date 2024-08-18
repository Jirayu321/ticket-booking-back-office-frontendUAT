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
}: {
  Event_Name: string;
  Event_Addr: string;
  Event_Desc: string;
  Event_Date: string;
  Event_Time: string;
  Event_Status: number;
  Event_Public: string;
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
    });

    if (response.status !== 200) throw "";

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
    const response = await authAxiosClient.patch(
      `/event-list/${eventId}`,
      newValue
    );

    if (response.status !== 200) throw "";
  } catch (error: any) {
    throw "ล้มเหลวระหว่างอัพเดทข้อมูล event";
  }
}
