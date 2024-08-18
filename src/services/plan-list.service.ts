import { authAxiosClient } from "../config/axios.config";

export async function getPlansList() {
    try {
      const response = await authAxiosClient.get("/plan-list");
  
      if (response.status !== 200) {
        throw "ล้มเหลวระหว่างดึงรายการ plan ทั้งหมด";
      }
  
      return response.data;
    } catch (error) {
      throw "ล้มเหลวระหว่างดึงรายการ plan ทั้งหมด";
    }
  }