import { authAxiosClient } from "../config//axios.config";

export const getViewEventStock = async (eventId: number) => {
  const res = await authAxiosClient.get(
    `/api/getViewEventStock?eventId=${eventId}`
  );
  console.log("getViewEventStock:", res.data);
  return res.data;
};

export const getAvailableTablesByPlan = async (
  eventId: number,
  planId: number
) => {
  const res = await authAxiosClient.get(
    `/api/getAvailableTablesByPlan?eventId=${Number(eventId)}&planId=${Number(
      planId
    )}`
  );
  console.log("getAvailableTablesByPlan:", res.data);
  return res.data;
};
