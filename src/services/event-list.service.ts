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
