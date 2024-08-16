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
    
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้าง event";
  }
}
