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

// Function to update (patch) an existing "Pay By" option
export async function updatePayBy({
  Pay_By_Id,
  Pay_By_Name,
  Pay_By_Desc,
  Pay_By_Active,
}: {
  Pay_By_Id: number;
  Pay_By_Name: string;
  Pay_By_Desc?: string;
  Pay_By_Active: string;
}) {
  try {
    const response = await authAxiosClient.patch(`/set-pay-by/${Pay_By_Id}`, {
      Pay_By_Name,
      Pay_By_Desc: Pay_By_Desc || "",
      Pay_By_Active,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update pay by");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างอัปเดตรายการการจ่ายเงิน");
  }
}

// Function to delete an existing "Pay By" option
export async function deletePayBy(Pay_By_Id: number) {
  try {
    const response = await authAxiosClient.delete(`/set-pay-by/${Pay_By_Id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete pay by");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างลบรายการการจ่ายเงิน");
  }
}
