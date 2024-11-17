import { authAxiosClient } from "../config/axios.config";

export async function getAllEmp() {
  try {
    const response = await authAxiosClient.get("/employee");

    if (response.status !== 200) {
      throw new Error("ล้มเหลวระหว่างดึงรายการทั้งหมด");
    }
    return response.data;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงรายการทั้งหมด");
  }
}

export async function getAllPosition() {
  try {
    const response = await authAxiosClient.get("/position");

    if (response.status !== 200) {
      throw new Error("ล้มเหลวระหว่างดึงรายการทั้งหมด");
    }
    return response.data;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงรายการทั้งหมด");
  }
}

export async function createEmployee({
  Emp_Code,
  Emp_Prefix,
  Emp_Name,
  Emp_Dept,
  Emp_Position,
  Emp_Position_Detail,
  Emp_StartDate,
  Emp_Tel,
  Emp_Status,
  Emp_UUser,
  Emp_PPass,
}: {
  Emp_Code: string;
  Emp_Prefix: string;
  Emp_Name: string;
  Emp_Dept: number;
  Emp_Position: number;
  Emp_Position_Detail: string;
  Emp_StartDate: string | null;
  Emp_Tel: string;
  Emp_Status: string;
  Emp_UUser: string;
  Emp_PPass: string;
}) {
  try {
    const response = await authAxiosClient.post("/employee", {
      Emp_Code,
      Emp_Prefix,
      Emp_Name,
      Emp_Dept,
      Emp_Position,
      Emp_Position_Detail,
      Emp_StartDate,
      Emp_Tel,
      Emp_Status,
      Emp_UUser,
      Emp_PPass,
    });

    if (response.status !== 200) {
      console.error(
        "Error: Failed to create employee. Status code:",
        response.status
      );
      throw new Error("Failed to create employee");
    }

    console.log(
      "[INFO]: Employee created successfully. Response:",
      response.data
    );
    return response.data; // Return the response data for further processing
  } catch (error: any) {
    console.error(
      "[ERROR]: Failed to create employee. Error:",
      error.message || error
    );
    throw new Error("ล้มเหลวระหว่างสร้างพนักงาน");
  }
}

export async function patchEmployee({
  Emp_Id,
  Emp_Code,
  Emp_Prefix,
  Emp_Name,
  Emp_Dept,
  Emp_Position,
  Emp_Position_Detail,
  Emp_StartDate,
  Emp_Tel,
  Emp_Status,
  Emp_UUser,
  Emp_PPass,
  Emp_PIN,
  Gold_SO,
  Comp_Id,
}: {
  Emp_Id: number;
  Emp_Code?: string;
  Emp_Prefix?: string;
  Emp_Name?: string;
  Emp_Dept?: number;
  Emp_Position?: number;
  Emp_Position_Detail?: string;
  Emp_StartDate?: string | null; // รองรับค่าที่ไม่มีเป็น null
  Emp_Tel?: string;
  Emp_Status?: string;
  Emp_UUser?: string;
  Emp_PPass?: string;
  Emp_PIN?: string;
  Gold_SO?: number;
  Comp_Id?: number;
}) {
  try {
    const response = await authAxiosClient.patch(`/employee/${Emp_Id}`, {
      Emp_Code,
      Emp_Prefix,
      Emp_Name,
      Emp_Dept,
      Emp_Position,
      Emp_Position_Detail,
      Emp_StartDate,
      Emp_Tel,
      Emp_Status,
      Emp_UUser,
      Emp_PPass,
      Emp_PIN,
      Gold_SO,
      Comp_Id,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update employee");
    }

    console.log("[INFO]: Employee updated successfully");
    return response.data;
  } catch (error: any) {
    console.error("[ERROR]: Failed to update employee:", error.message);
    throw new Error("ล้มเหลวระหว่างอัปเดตพนักงาน");
  }
}

export async function deleteEmp(Emp_Id: number) {
  try {
    const response = await authAxiosClient.delete(`/employee/${Emp_Id}`);

    if (response.status !== 200) {
      throw "Failed to delete ";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างลบ ";
  }
}
