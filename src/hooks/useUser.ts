import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUserInfo } from "../services/auth.service";

export function useUser() {
  const query = useQuery({
    queryKey: ["fetch user info"],
    queryFn: async () => {
      try {
        return await getUserInfo();
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
  });
  return query;
}
