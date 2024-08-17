import { authAxiosClient } from "../config/axios.config";

export async function getPayBy() {
  try {
    const response = await authAxiosClient.get("/set-pay-by");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
  }
}
// Function to create a new "Pay By" option
export async function createPayBy({
  Pay_By_Name,
  Pay_By_Desc,
  Pay_By_Active,
  Created_By,
}: {
  Pay_By_Name: string;
  Pay_By_Desc?: string;
  Pay_By_Active: string;
  Created_By: string;
}) {
  try {
    const response = await authAxiosClient.post("/set-pay-by", {
      Pay_By_Name,
      Pay_By_Desc: Pay_By_Desc || "",
      Pay_By_Active,
      Created_By,
    });

    if (response.status !== 200) {
      throw "Failed to create pay by";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้างรายการการจ่ายเงิน";
  }
}


