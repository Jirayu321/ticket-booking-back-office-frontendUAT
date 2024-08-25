import { Button, CircularProgress } from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchTicketNoPerPlanByEventId } from "../../../hooks/fetch-data/useFetchTicketNoPerPlanByEventId";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import { useSyncPlanInfo } from "../_hook/useSyncPlanInfo";
import { PlanInfo } from "../type";
import Body from "./Body";
import Header from "./Header";
import styles from "./plan.module.css";
import toast from "react-hot-toast";
import { updateEventStock } from "../../../services/event-stock.service";

type PlanProps = {
  plan: any;
  plans: any[];
  onExpand: any;
  expandedZones: Record<string, boolean>;
};

const Plan: FC<PlanProps> = ({ plan, onExpand, plans, expandedZones }) => {
  const { eventId } = useParams();

  const {
    Plan_Id,
    Plan_Name,
    Plan_Desc,
    PlanGroup_Id,
    Ticket_Type_Id,
    Ticket_Qty_Per,
    Ticket_Qty,
  } = plan;

  const { data: viewLogEventPrices, isPending: isLoadingViewLogEventPrice, refetch : refreshViewEventStocks } =
    useFetchViewLogEventPrice({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  const { data: ticketNoPerPlans, isPending: isLoadingTicketNoPerPlans } =
    useFetchTicketNoPerPlanByEventId({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    ticketTypeId: null,
    ticketQtyPerPlan: 0,
    seatQtyPerticket: 0,
    logEventPrices: [],
    ticketNumbers: [],
    planId: 0,
  });

  useSyncPlanInfo({
    ticketTypeId: Ticket_Type_Id,
    ticketQtyPerPlan: Ticket_Qty_Per,
    seatQtyPerticket: Ticket_Qty,
    logEventPrices: viewLogEventPrices,
    ticketNumbers: ticketNoPerPlans,
    planId: Number(Plan_Id),
    setPlanInfo,
  });

  async function handleUpdateViewEventStock() {
    try {
      toast.loading("กำลังบันทึกข้อมูล...");
      await updateEventStock({
        eventId: Number(eventId),
        planGroupId: PlanGroup_Id,
        planId: Plan_Id,
        newValues: {
          Ticket_Type_Id: planInfo.ticketTypeId,
          Ticket_Qty_Per: planInfo.ticketQtyPerPlan,
          Ticket_Qty: planInfo.seatQtyPerticket,
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

  if (isLoadingViewLogEventPrice || isLoadingTicketNoPerPlans)
    return <CircularProgress />;

  return (
    <div className={styles.container}>
      <Header
        onExpand={onExpand}
        Plan_Id={Plan_Id}
        Plan_Name={Plan_Name}
        Plan_Desc={Plan_Desc}
      />
      <Body
        zone={planInfo}
        zones={plans}
        expandedZones={expandedZones}
        handleInputChange={() => {}}
        handlePriceChange={() => {}}
        removeZonePrice={() => {}}
        addZonePrice={() => {}}
        onUpdatePlanInfo={setPlanInfo}
      />
      {expandedZones[Plan_Id] ? (
        <Button
          color="success"
          variant="contained"
          className={styles.saveButtonContainer}
          onClick={handleUpdateViewEventStock}
        >
          บันทึกข้อมูล
        </Button>
      ) : null}
    </div>
  );
};

export default Plan;
