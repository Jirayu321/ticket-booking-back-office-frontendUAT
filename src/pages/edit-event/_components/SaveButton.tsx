import { Button } from "@mui/material";
import { FC } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { SwalError, SwalSuccess } from "../../../lib/sweetalert";
import { updateEventStock } from "../../../services/event-stock.service";
import {
  createLogEventPrice,
  deleteLogEventPrice,
} from "../../../services/log-event-price.service";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import styles from "./plan.module.css";

type SaveButtonProps = {
  planGroupId: number;
  planId: number;
  refreshViewEventStocks: () => void;
};

const SaveButton: FC<SaveButtonProps> = ({
  planGroupId,
  planId,
  refreshViewEventStocks,
}) => {
  const state = usePlanInfoStore((state: any) => state);
  const {
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    deletedLogEventPriceIds,
    createdLogEventPriceIds,
    logEventPrices,
  } = state;
  const { eventId } = useParams();

  async function handleUpdateViewEventStock() {
    try {
      toast.loading("กำลังบันทึกข้อมูล...");

      await updateEventStock({
        eventId: Number(eventId),
        planGroupId,
        planId,
        newValues: {
          Ticket_Type_Id: ticketTypeId,
          Ticket_Qty_Per: ticketQtyPerPlan,
          Ticket_Qty: seatQtyPerticket,
        },
      });

      // ลบ log event prices
      const deleteLogEventPricePromises = Promise.all(
        deletedLogEventPriceIds.map((id: number) => {
          return deleteLogEventPrice(id);
        })
      );

      await deleteLogEventPricePromises;

      // เพิ่ม log event prices
      const createLogEventPrices = Promise.all(
        createdLogEventPriceIds.map((id: number) => {
          const logEventPriceInfo = logEventPrices.find(
            (lep: any) => lep.id === id
          );

          if (!logEventPriceInfo)
            throw new Error("ไม่พบข้อมูล log event price");

          return createLogEventPrice({
            Created_By: "admin",
            Created_Date: new Date().toISOString(),
            End_Datetime: logEventPriceInfo.End_Datetime,
            Event_Id: Number(eventId),
            PlanGroup_Id: planGroupId,
            Plan_Id: planId,
            Plan_Price: logEventPriceInfo.Plan_Price,
            Start_Datetime: logEventPriceInfo.Start_Datetime,
          });
        })
      );

      await createLogEventPrices;

      toast.dismiss();

      SwalSuccess("บันทึกข้อมูลสำเร็จ");

      refreshViewEventStocks();
    } catch (error: any) {
      toast.dismiss();
      SwalError(error.message);
    }
  }

  return (
    <Button
      color="success"
      variant="contained"
      className={styles.saveButtonContainer}
      onClick={handleUpdateViewEventStock}
    >
      บันทึกข้อมูล
    </Button>
  );
};

export default SaveButton;
