import { authAxiosClient } from "../config/axios.config";

// ================= READ =================
export async function getHispayment() {
  try {
    const response = await authAxiosClient.get("/his-payment");

    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }

    return response.data.paymentHistory;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
  }
}

export async function getPaymentHistoriesByOrderId(orderId: string) {
  try {
    const response = await authAxiosClient.get(`/his-payment/${orderId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }

    return response.data.paymentHistories; 
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
  }
}
