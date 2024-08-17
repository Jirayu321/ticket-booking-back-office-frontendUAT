import { authAxiosClient } from "../config/axios.config";

export async function getAllPlanGroups() {
  try {
    const response = await authAxiosClient.get("/plan-group");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
  }
}

export async function createPlanGroup({
  PlanGroup_Name,
  PlanGroup_Active,
  Created_By,
}: {
  PlanGroup_Name: string;
  PlanGroup_Active: string;
  Created_By: string;
}) {
  try {
    const response = await authAxiosClient.post("/plan-group", {
      PlanGroup_Name,
      PlanGroup_Active,
      Created_By,
    });

    if (response.status !== 200) throw "Failed to create plan group";
  } catch (error) {
    throw "ล้มเหลวระหว่างสร้าง plan group";
  }
}
