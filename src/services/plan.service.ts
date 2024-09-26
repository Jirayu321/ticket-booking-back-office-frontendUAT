import { authAxiosClient } from "../config/axios.config";
import imageCompression from 'browser-image-compression';


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
    // Function to compress image to 500 KB or less
    const compressImage = async (image: string | null) => {
      if (!image) return null;

      // Convert base64 to Blob
      const blob = await fetch(image).then(res => res.blob());

      // Log original image size
      console.log('Original Image Size:', blob.size);

      // Convert Blob to File object
      let file = new File([blob], 'image.jpg', { type: blob.type });

      // Compress the image until it is 500 KB or less
      const options = {
        maxSizeMB: 0.5, // Target size of 500 KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = file;
      while (compressedFile.size > 500 * 1024) {
        compressedFile = await imageCompression(compressedFile, options);
        console.log('Compressed Image Size:', compressedFile.size);
      }

      // Convert compressed File back to base64
      return await imageCompression.getDataUrlFromFile(compressedFile);
    };

    // Compress Plan_Pic if it exists
    const compressedPic = Plan_Pic ? await compressImage(Plan_Pic) : "";

    const response = await authAxiosClient.post("/plan", {
      Plan_Desc,
      Plan_Name,
      Plan_Pic: compressedPic,
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

export async function patchPlan({
  Plan_id,
  Plan_Desc,
  Plan_Name,
  Plan_Pic,
  Plan_Active,
  PlanGroup_id,
}: {
  Plan_id: number;
  Plan_Desc?: string;
  Plan_Name?: string;
  Plan_Pic?: string;
  Plan_Active?: string;
  PlanGroup_id?: number | null;
}) {
  try {
    // Function to compress image to 500 KB or less
    const compressImage = async (image: string | null) => {
      if (!image) return null;

      // Convert base64 to Blob
      const blob = await fetch(image).then(res => res.blob());

      // Log original image size
      console.log('Original Image Size:', blob.size);

      // Convert Blob to File object
      let file = new File([blob], 'image.jpg', { type: blob.type });

      // Compress the image until it is 500 KB or less
      const options = {
        maxSizeMB: 0.5, // Target size of 500 KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = file;
      while (compressedFile.size > 500 * 1024) {
        compressedFile = await imageCompression(compressedFile, options);
        console.log('Compressed Image Size:', compressedFile.size);
      }

      // Convert compressed File back to base64
      return await imageCompression.getDataUrlFromFile(compressedFile);
    };

    // Compress Plan_Pic if it exists
    const compressedPic = Plan_Pic ? await compressImage(Plan_Pic) : "";

    const response = await authAxiosClient.patch(`/plan/${Plan_id}`, {
      Plan_Desc,
      Plan_Name,
      Plan_Pic: compressedPic,
      Plan_Active,
      PlanGroup_id,
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
