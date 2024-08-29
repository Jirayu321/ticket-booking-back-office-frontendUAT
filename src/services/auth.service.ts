import { isAxiosError } from "axios";
import { authAxiosClient } from "../config/axios.config";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await authAxiosClient.post("/auth", {
      username,
      password,
    });

    if (response.status !== 200) {
      throw new Error("ล้มเหลวในการเข้าสู่ระบบ");
    }

    return response.data.token;
  } catch (error: any) {
    let errorMessage: string = error.message;

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message;
    }

    throw new Error(errorMessage);
  }
}
