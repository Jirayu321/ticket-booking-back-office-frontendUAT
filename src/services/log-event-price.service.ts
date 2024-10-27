import { authAxiosClient } from "../config/axios.config";
import { addHours } from "../lib/util";

const HOURS_DIFF = 7;

// ============ GET ============

export async function getLogEventPrice() {
  try {
    const response = await authAxiosClient.get(`/log-event-price`);

    if (response.status !== 200) throw new Error();

    return response.data.logEventPrices || [];
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างการดึงข้อมูล ราคาของ อีเวนท์");
  }
}


// ============ CREATE ============

export async function createLogEventPrice({
  Created_By,
  Created_Date,
  End_Datetime,
  Event_Id,
  PlanGroup_Id,
  Plan_Id,
  Plan_Price,
  Start_Datetime,
}: {
  Created_By: string;
  Created_Date: string;
  End_Datetime: string;
  Event_Id: number;
  PlanGroup_Id: number;
  Plan_Id: number;
  Plan_Price: number;
  Start_Datetime: string;
}) {
  try {
    const response = await authAxiosClient.post("/log-event-price", {
      Created_By,
      Created_Date: addHours(new Date(Created_Date), HOURS_DIFF).toISOString(),
      End_Datetime: addHours(new Date(End_Datetime), HOURS_DIFF).toISOString(),
      Event_Id,
      PlanGroup_Id,
      Plan_Id,
      Plan_Price,
      Start_Datetime: addHours(
        new Date(Start_Datetime),
        HOURS_DIFF
      ).toISOString(),
    });

    if (response.status !== 200) throw new Error();
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างการสร้าง ราคาของ อีเวนท์");
  }
}

// ============ UPDATE ============
export async function updateLogEventPrice({
  logId,
  startDateTime,
  endDateTime,
  updateBy,
  planPrice,
}: {
  logId: number;
  startDateTime: string;
  endDateTime: string;
  updateBy: string;
  planPrice: number;
}) {
  try {
    const response = await authAxiosClient.patch(`/log-event-price/${logId}`, {
      startDateTime,
      endDateTime,
      updateBy,
      planPrice,
    });

    if (response.status !== 200) throw new Error();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ============ DELETE ============
export async function deleteLogEventPrice(logId: number) {
  try {
    const response = await authAxiosClient.delete(`/log-event-price/${logId}`);
    if (response.status !== 200) throw new Error();
  } catch (error: any) {
    throw new Error("ล้มเหลวระหว่างการลบ ราคาของ อีเวนท์");
  }
}
