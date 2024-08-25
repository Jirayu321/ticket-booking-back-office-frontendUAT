import { authAxiosClient } from "../config/axios.config";

export async function getViewEventStocks({ eventId }: { eventId: number }) {
  const response = await authAxiosClient.get(`/view-event-stock/${eventId}`);

  if (response.status !== 200)
    throw new Error("ล้มเหลวระหว่างการดึงข้อมูล Event Stock");

  return response ? response.data.eventStocks : null;
}

export async function updateViewEventStock({
  id,
  startDate,
  endDate,
  price,
}: {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
}) {
  const response = await authAxiosClient.patch(`/view-event-stock/${id}`, {
    startDate,
    endDate,
    price,
  });

  if (response.status !== 200)
    throw new Error("ล้มเหลวระหว่างการอัพเดท Event Stock");

  return response ? response.data : null;
}
