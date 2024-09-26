import { authAxiosClient } from "../config/axios.config";
import imageCompression from 'browser-image-compression';

export async function getAllEventList() {
  try {
    const response = await authAxiosClient.get("/event-list");

    if (response.status !== 200) {
      throw "ล้มเหลวระหว่างดึงรายการ events ทั้งหมด";
    }

    return response.data;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงรายการ events ทั้งหมด";
  }
}

export async function createEvent({
  Event_Name,
  Event_Addr,
  Event_Desc,
  Event_Date,
  Event_Time,
  Event_Status,
  Event_Public,
  Event_Pic_1,
  Event_Pic_2,
  Event_Pic_3,
  Event_Pic_4,
}: {
  Event_Name: string;
  Event_Addr: string;
  Event_Desc: string;
  Event_Date: string;
  Event_Time: string;
  Event_Status: number;
  Event_Public: string;
  Event_Pic_1: string | null; // Expect base64 or file URL
  Event_Pic_2?: string | null; // Optional images
  Event_Pic_3?: string | null;
  Event_Pic_4?: string | null;
}) {
  try {
    // Function to compress image to 200 KB or less
    const compressImage = async (image: string | null) => {
      if (!image) return null;

      // Convert base64 to Blob
      const blob = await fetch(image).then(res => res.blob());

      // Log original image size
      console.log('Original Image Size:', blob.size);

      // Convert Blob to File object
      let file = new File([blob], 'image.jpg', { type: blob.type });

      // Compress the image until it is 200 KB or less
      const options = {
        maxSizeMB: 0.2, // Target size of 200 KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = file;
      while (compressedFile.size > 200 * 1024) {
        compressedFile = await imageCompression(compressedFile, options);
        console.log('Compressed Image Size:', compressedFile.size);
      }

      // Convert compressed File back to base64
      return await imageCompression.getDataUrlFromFile(compressedFile);
    };

    // Compress images
    const compressedPic1 = await compressImage(Event_Pic_1);
    const compressedPic2 = await compressImage(Event_Pic_2);
    const compressedPic3 = await compressImage(Event_Pic_3);
    const compressedPic4 = await compressImage(Event_Pic_4);

    const response = await authAxiosClient.post("/event-list", {
      Event_Name,
      Event_Addr,
      Event_Desc,
      Event_Date,
      Event_Time,
      Event_Status,
      Event_Public,
      Event_Pic_1: compressedPic1,
      Event_Pic_2: compressedPic2,
      Event_Pic_3: compressedPic3,
      Event_Pic_4: compressedPic4,
    });

    if (!(response.status === 201 || response.status === 200))
      throw new Error("สร้าง event ล้มเหลว");

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getEventById(eventId: number) {
  try {
    const response = await authAxiosClient.get(`/event-list/${eventId}`);

    if (response.status !== 200) throw "";

    return response.data.event;
  } catch (error: any) {
    throw "ล้มเหลวระหว่างดึงข้อมูล event";
  }
}

export async function updateEventById(eventId: number, newValue: any) {
  try {
    const response = await authAxiosClient.patch(`/event-list/${eventId}`, {
      ...newValue,
      // Event_Pic_1: newValue.Event_Pic_1 || null, // Add image fields
      // Event_Pic_2: newValue.Event_Pic_2 || null,
      // Event_Pic_3: newValue.Event_Pic_3 || null,
      // Event_Pic_4: newValue.Event_Pic_4 || null,
    });

    if (response.status !== 200) throw "";
  } catch (error: any) {
    throw "ล้มเหลวระหว่างอัพเดทข้อมูล event";
  }
}
