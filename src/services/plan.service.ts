import { authAxiosClient } from "../config/axios.config";

export async function getAllPlans() {
  try {
    const response = await authAxiosClient.get("/plan");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด";
  }
}
