import { Button } from "@mui/material";
import { FC } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { SwalError, SwalSuccess } from "../../../lib/sweetalert";
import { updateEventStock } from "../../../services/event-stock.service";
import {
  createLogEventPrice,
  deleteLogEventPrice,
  updateLogEventPrice,
} from "../../../services/log-event-price.service";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import styles from "./plan.module.css";
import { validateLogEventPrices } from "../helper";

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
    deletedLogEventPrices,
    createdLogEventPriceIds,
    logEventPrices,
  } = state;
  const { eventId } = useParams();

  async function handleUpdateViewEventStock() {
    try {
      toast.loading("กำลังบันทึกข้อมูล...");

      const { isValid, message } = validateLogEventPrices(logEventPrices);

      if (!isValid) {
        SwalError(message);
        toast.dismiss();
        return;
      }

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
        deletedLogEventPrices.map((lep: any) => {
          const isLogEventFromDB = Object.keys(lep).includes("Log_Id");
          return isLogEventFromDB ? deleteLogEventPrice(lep.Log_Id) : null;
        })
      );

      await deleteLogEventPricePromises;

      // เพิ่ม log event prices
      const createLogEventPricePromises = Promise.all(
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

      await createLogEventPricePromises;

      // อัพเดท log event prices
      const updateLogEventPricePromises = Promise.all(
        logEventPrices
          .filter((lep: any) => !createdLogEventPriceIds.includes(lep.id))
          .map((lep: any) => {
            return updateLogEventPrice({
              logId: lep.Log_Id,
              startDateTime: lep.Start_Datetime,
              endDateTime: lep.End_Datetime,
              updateBy: "admin",
              planPrice: lep.Plan_Price,
            });
          })
      );

      await updateLogEventPricePromises;

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
