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

// Function to update an existing plan group
export async function updatePlanGroup({
  PlanGroup_id,
  PlanGroup_Name,
  PlanGroup_Active,
}: {
  PlanGroup_id: number;
  PlanGroup_Name: string;
  PlanGroup_Active: string;
}) {
  try {
    const response = await authAxiosClient.patch(
      `/plan-group/${PlanGroup_id}`,
      {
        PlanGroup_Name,
        PlanGroup_Active,
      }
    );

    if (response.status !== 200) {
      throw "Failed to update plan group";
    }

    return response.data;
  } catch (error) {
    throw "ล้มเหลวระหว่างอัปเดต PlanGroup";
  }
}

// Function to delete an existing plan group
export async function deletePlanGroup(PlanGroup_id: number) {
  try {
    const response = await authAxiosClient.delete(
      `/plan-group/${PlanGroup_id}`
    );

    if (response.status !== 200) {
      throw "Failed to delete plan group";
    }

    return response.data;
  } catch (error) {
    throw "ล้มเหลวระหว่างลบ PlanGroup";
  }
}

export async function getAllPlan_TicketNo() {
  try {
    const response = await authAxiosClient.get("/Plan_TicketNo");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ plan group ทั้งหมด";
  }
}
