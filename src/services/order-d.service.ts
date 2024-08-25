import { authAxiosClient } from "../config/axios.config";

export async function getOrderD() {
  try {
    const response = await authAxiosClient.get("/order-d");

    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }

    return response.data.orderD; // Corrected to return paymentHistory instead of eventStocks
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
  }
}