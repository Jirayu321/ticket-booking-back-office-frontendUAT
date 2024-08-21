import { authAxiosClient } from "../config/axios.config";
import { addHours } from "../lib/util";

const HOURS_DIFF = 7;

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
      Created_Date : addHours(new Date(Created_Date), HOURS_DIFF).toISOString(),
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
    throw "ล้มเหลวระหว่างการสร้าง ราคาของ อีเว็นท์";
  }
}
