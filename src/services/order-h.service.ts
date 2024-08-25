import { authAxiosClient } from "../config/axios.config";

export async function getOrderH() {
  try {
    const response = await authAxiosClient.get("/order-h");

    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }

    return response.data.orderH; // Corrected to return paymentHistory instead of eventStocks
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
  }
}