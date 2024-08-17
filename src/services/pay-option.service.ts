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