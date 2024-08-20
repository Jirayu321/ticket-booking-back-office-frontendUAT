import { authAxiosClient } from "../config/axios.config";

export async function getViewLogEventPrice({
  eventId,
  planGroupId,
  planId,
}: {
  eventId: number;
  planGroupId: number;
  planId: number;
}) {
  const response = await authAxiosClient.get(
    `/view-log-event-price/${eventId}?planGroupId=${planGroupId}&planId=${planId}`
  );

  if (response.status !== 200)
    throw new Error("ล้มเหลวระหว่างการดึงข้อมูล Event Price");

  return response.data.logEventPrice;
}
