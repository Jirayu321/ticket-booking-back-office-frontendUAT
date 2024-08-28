import { Button } from "@mui/material";
import { FC } from "react";
import toast from "react-hot-toast";
import styles from "./plan.module.css";
import { useParams } from "react-router-dom";
import { updateEventStock } from "../../../services/event-stock.service";
import usePlanInfoStore from "../_hook/usePlanInfoStore";

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
  const { ticketTypeId, ticketQtyPerPlan, seatQtyPerticket } = state;
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
      toast.dismiss();
      toast.success("บันทึกข้อมูลสำเร็จ");
      refreshViewEventStocks();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
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
