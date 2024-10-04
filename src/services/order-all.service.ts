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

export const updateOrder = async (orderid) => {
  try {
    // เรียกใช้ authAxiosClient สำหรับการอัปเดต order โดยใช้ order_id
    const response = await authAxiosClient.get(`/order/${orderid}`);

    // ตรวจสอบ response status
    if (response.status !== 200) {
      throw new Error("Failed to update order");
    }

    // ส่งผลลัพธ์กลับ
    return response.data;
  } catch (error) {
    // จัดการข้อผิดพลาด
    throw new Error("ล้มเหลวระหว่างการอัปเดตข้อมูลคำสั่งซื้อ");
  }
};

