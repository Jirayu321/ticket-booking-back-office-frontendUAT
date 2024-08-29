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

export async function getUserInfo() {
  const token = localStorage.getItem("token");
  try {
    const response = await authAxiosClient.get("/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status == 400) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error("ล้มเหลวในการดึงข้อมูลผู้ใช้");
    }

    return response.data.userInfo;
  } catch (error: any) {
    let errorMessage: string = error.message;

    if (isAxiosError(error)) {
      errorMessage = error.response?.data.message;
    }

    throw new Error(errorMessage);
  }
}
