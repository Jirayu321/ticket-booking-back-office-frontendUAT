import { authAxiosClient } from "../config/axios.config";

export async function getOrderAll() {
  try {
    const response = await authAxiosClient.get("/orderAll");

    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }

    return response.data; // Corrected to return paymentHistory instead of eventStocks
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
  }
}