import { authAxiosClient } from "../config/axios.config";

export async function getViewTicketList() {
    try {
      const response = await authAxiosClient.get("/view-ticket-list");
  
      if (response.status !== 200) throw new Error();
  
      return response.data;
    } catch (error: any) {
      throw "ล้มเหลวระหว่างดึงรายการประเภทตั๋วทั้งหมด";
    }
  }
  