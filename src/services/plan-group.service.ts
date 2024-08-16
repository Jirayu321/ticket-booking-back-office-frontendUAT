import { authAxiosClient } from "../config/axios.config";

export async function getAllPlanGroups() {
  try {
    const response = await authAxiosClient.get("/plan-group");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
  }
}
