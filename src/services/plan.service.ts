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

export async function getAllPlan_TicketNo2() {
  try {
    const response = await authAxiosClient.get("/planticketno");

    if (response.status !== 200) {
      throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
    }
    return response.data;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
  }
}



export async function createPlan({
  Plan_Desc,
  Plan_Name,
  Plan_Pic,
  Plan_Active,
  PlanGroup_id = null,
  Plan_Ticket_Type_Id,
  Plan_Ticket_Qty,
  Plan_Ticket_Qty_Per,
  Plan_Colour_Code,
}: {
  Plan_Desc: string;
  Plan_Name: string;
  Plan_Pic?: string;
  Plan_Active: string;
  PlanGroup_id?: number | null;
  Plan_Ticket_Type_Id: number;
  Plan_Ticket_Qty: number;
  Plan_Ticket_Qty_Per: number;
  Plan_Colour_Code: string;
}) {
  try {
    const response = await authAxiosClient.post("/plan", {
      Plan_Desc,
      Plan_Name,
      Plan_Pic: Plan_Pic || "",
      Plan_Active,
      PlanGroup_id,
      Plan_Ticket_Type_Id,
      Plan_Ticket_Qty,
      Plan_Ticket_Qty_Per,
      Plan_Colour_Code,
    });
    if (response.status !== 200) {
      throw "Failed to create plan";
    }
    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างสร้าง plan";
  }
}

export async function patchPlan({
  Plan_id,
  Plan_Desc,
  Plan_Name,
  Plan_Pic,
  Plan_Ticket_Type_Id,
  Plan_Ticket_Qty,
  Plan_Ticket_Qty_Per,
  Plan_Active,
  PlanGroup_id,
  dataTicketValue
}: {
  Plan_id: number;
  Plan_Desc?: string;
  Plan_Name?: string;
  Plan_Pic?: string;
  Plan_Ticket_Type_Id?: number;
  Plan_Active?: string;
  PlanGroup_id?: number | null;
  dataTicketValue?: any[] | [];
  Plan_Ticket_Qty: number;
  Plan_Ticket_Qty_Per: number;
}) {
  try {
    const response = await authAxiosClient.patch(`/plan/${Plan_id}`, {
      Plan_Desc,
      Plan_Name,
      Plan_Pic,
      Plan_Ticket_Type_Id,
      Plan_Ticket_Qty,
      Plan_Ticket_Qty_Per,
      Plan_Active,
      PlanGroup_id,
      dataTicketValue
    });

    if (response.status !== 200) {
      throw "Failed to update plan";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างอัปเดต plan";
  }
}

export async function deletePlan(Plan_id: number) {
  try {
    const response = await authAxiosClient.delete(`/plan/${Plan_id}`);

    if (response.status !== 200) {
      throw "Failed to delete plan";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างลบ plan";
  }
}
