import { authAxiosClient } from "../config/axios.config";

export async function getPayOption() {
  try {
    const response = await authAxiosClient.get("/set-pay-option");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
  }
}

export async function createPayOption({
  Pay_Opt_Name,
  Pay_Opt_Desc,
  Pay_Opt_Active,
  Created_By,
}: {
  Pay_Opt_Name: string;
  Pay_Opt_Desc?: string;
  Pay_Opt_Active: string;
  Created_By: string;
}) {
  try {
    const response = await authAxiosClient.post("/set-pay-option", {
      Pay_Opt_Name,
      Pay_Opt_Desc: Pay_Opt_Desc || "",
      Pay_Opt_Active,
      Created_By,
    });

    if (response.status !== 200) {
      throw "Failed to create payment option";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้างรายการการจ่ายเงิน";
  }
}

// Function to update (patch) an existing payment option
export async function updatePayOption({
  Pay_Opt_Id,
  Pay_Opt_Name,
  Pay_Opt_Desc,
  Pay_Opt_Active,
}: {
  Pay_Opt_Id: number;
  Pay_Opt_Name: string;
  Pay_Opt_Desc?: string;
  Pay_Opt_Active: string;
}) {
  try {
    const response = await authAxiosClient.patch(`/set-pay-option/${Pay_Opt_Id}`, {
      Pay_Opt_Name,
      Pay_Opt_Desc: Pay_Opt_Desc || "",
      Pay_Opt_Active,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update payment option");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างอัปเดตรายการการจ่ายเงิน");
  }
}

// Function to delete an existing payment option
export async function deletePayOption(Pay_Opt_Id: number) {
  try {
    const response = await authAxiosClient.delete(`/set-pay-option/${Pay_Opt_Id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete payment option");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างลบรายการการจ่ายเงิน");
  }
}