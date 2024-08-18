import { authAxiosClient } from "../config/axios.config";

export async function getAllPlans() {
  try {
    const response = await authAxiosClient.get("/plan");

    if (response.status !== 200) {
      throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
    }

    return response.data;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
  }
}

// Function to create a new plan
export async function createPlan({
  Plan_Desc,
  Plan_Name,
  Plan_Pic,
  Plan_Active,
  PlanGroup_id = null,
}: {
  Plan_Desc: string;
  Plan_Name: string;
  Plan_Pic?: string;
  Plan_Active: string;
  PlanGroup_id?: number | null;
}) {
  try {
    const response = await authAxiosClient.post("/plan", {
      Plan_Desc,
      Plan_Name,
      Plan_Pic: Plan_Pic || "",
      Plan_Active,
      PlanGroup_id,
    });

    if (response.status !== 200) {
      throw "Failed to create plan";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้าง plan";
  }
}

