import { authAxiosClient } from "../config/axios.config";

export const getTableMoveHistory = async () => {
  const response = await authAxiosClient.get("/api/table-move");
  return response.data;
};
