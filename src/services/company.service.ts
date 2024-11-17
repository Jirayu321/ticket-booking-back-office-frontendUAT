import { authAxiosClient } from "../config/axios.config";

export async function getAllcompany() {
  try {
    const response = await authAxiosClient.get("/company");

    if (response.status !== 200) {
      throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
    }
    return response.data;
  } catch (error) {
    throw new Error("ล้มเหลวระหว่างดึงรายการโซนร้านทั้งหมด");
  }
}

export async function createComp({
  Comp_Add1,
  Comp_Add2,
  Comp_Add3,
  Comp_Contact1,
  Comp_Contact2,
  Comp_Name_EN,
  Comp_Name_TH,
  Comp_ShortName,
  Comp_Post,
  Comp_Province,
  Comp_TaxNo,
  Comp_Tel1,
  Comp_Tel2,
}: {
  Comp_Add1: string;
  Comp_Add2: string;
  Comp_Add3: string;
  Comp_Contact1: string;
  Comp_Contact2: string;
  Comp_Name_EN: string;
  Comp_Name_TH: string;
  Comp_ShortName: string;
  Comp_Post: string;
  Comp_Province: string;
  Comp_TaxNo: string;
  Comp_Tel1: string;
  Comp_Tel2: string;
}) {
  try {
    const response = await authAxiosClient.post("/company", {
      Comp_Add1,
      Comp_Add2,
      Comp_Add3,
      Comp_Contact1,
      Comp_Contact2,
      Comp_Name_EN,
      Comp_Name_TH,
      Comp_ShortName,
      Comp_Post,
      Comp_Province,
      Comp_TaxNo,
      Comp_Tel1,
      Comp_Tel2,
    });

    if (response.status !== 201) {
      console.error(
        "Error: Failed to create company. Status code:",
        response.status
      );
      throw new Error("Failed to create company");
    }

    console.log(
      "[INFO]: Company created successfully. Response:",
      response.data
    );
    return response.data; // Return the response data for further processing
  } catch (error: any) {
    console.error(
      "[ERROR]: Failed to create company. Error:",
      error.message || error
    );
    throw new Error("ล้มเหลวระหว่างสร้างบริษัท");
  }
}

export async function patchComp({
  Comp_Id,
  Comp_Add1,
  Comp_Add2,
  Comp_Add3,
  Comp_Contact1,
  Comp_Contact2,
  Comp_Name_EN,
  Comp_Name_TH,
  Comp_ShortName,
  Comp_Post,
  Comp_Province,
  Comp_TaxNo,
  Comp_Tel1,
  Comp_Tel2,
}: {
  Comp_Id: number;
  Comp_Add1?: string;
  Comp_Add2?: string;
  Comp_Add3?: string;
  Comp_Contact1?: string;
  Comp_Contact2?: string;
  Comp_Name_EN?: string;
  Comp_Name_TH?: string;
  Comp_ShortName?: string;
  Comp_Post?: string;
  Comp_Province?: string;
  Comp_TaxNo?: string;
  Comp_Tel1?: string;
  Comp_Tel2?: string;
}) {
  try {
    const response = await authAxiosClient.patch(`/company/${Comp_Id}`, {
      Comp_Add1,
      Comp_Add2,
      Comp_Add3,
      Comp_Contact1,
      Comp_Contact2,
      Comp_Name_EN,
      Comp_Name_TH,
      Comp_ShortName,
      Comp_Post,
      Comp_Province,
      Comp_TaxNo,
      Comp_Tel1,
      Comp_Tel2,
    });

    if (response.status !== 200) {
      throw "Failed to update plan";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างอัปเดต plan";
  }
}

export async function deleteComp(Comp_Id: number) {
  try {
    const response = await authAxiosClient.delete(`/company/${Comp_Id}`);

    if (response.status !== 200) {
      throw "Failed to delete plan";
    }
  } catch (error: any) {
    throw "ล้มเหลวระหว่างลบ plan";
  }
}
