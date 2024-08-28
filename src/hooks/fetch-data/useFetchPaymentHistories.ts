import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPaymentHistoriesByOrderId } from "../../services/his-payment.service";

export function useFetchPaymentHistories({
  orderId,
}: {
  orderId: string | undefined | null;
}) {
  const query = useQuery({
    queryKey: ["fetch payment histories", orderId],
    queryFn: async () => {
      try {
        if (!orderId) return null;
        const paymentHistories = await getPaymentHistoriesByOrderId(orderId);
        return paymentHistories;
      } catch (error: any) {
        toast.error("ล้มเหลวระหว่างดึงข้อมูลประวัติการชำระเงิน");
        return null;
      }
    },
    enabled: Boolean(orderId),
  });
  return query;
}
