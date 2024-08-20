import { authAxiosClient } from "../config/axios.config";

export async function getViewEventStocks({
  eventId,
}: {
  eventId: number;
}) {
  const response = await authAxiosClient.get(`/view-event-stock/${eventId}`);

  if (response.status !== 200)
    throw new Error("ล้มเหลวระหว่างการดึงข้อมูล Event Stock");

  return response ? response.data.eventStocks : null;
}
