import { authAxiosClient } from "../config/axios.config";

export const getOrderRequestList = async () => {
  try {
    const response = await authAxiosClient.get("/api/order-request");
    return response.data; // สมมุติว่า API คืนเป็น array ของ order requests
  } catch (error) {
    console.error("❌ Failed to fetch Order_Request list:", error);
    return [];
  }
};
