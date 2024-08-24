import { Button, CircularProgress } from "@mui/material";
import { FC, useState } from "react";
import styles from "./plan.module.css";
import { useParams } from "react-router-dom";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import Header from "./Header";
import Body from "./Body";
import { PlanInfo } from "../type";
import { useFetchTicketNoPerPlanByEventId } from "../../../hooks/fetch-data/useFetchTicketNoPerPlanByEventId";
import { useSyncPlanInfo } from "../_hook/useSyncPlanInfo";

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

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  const { data: viewLogEventPrices, isPending: isLoadingViewLogEventPrice } =
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
  });

  useSyncPlanInfo({
    ticketTypeId: Ticket_Type_Id,
    ticketQtyPerPlan: Ticket_Qty_Per,
    seatQtyPerticket: Ticket_Qty,
    logEventPrices: viewLogEventPrices,
    ticketNumbers: ticketNoPerPlans,
    setPlanInfo,
  });

  console.log(planInfo)
  if (
    isLoadingTicketTypes ||
    isLoadingViewLogEventPrice ||
    isLoadingTicketNoPerPlans
  )
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
        zone={plan}
        zones={plans}
        expandedZones={expandedZones}
        handleInputChange={() => {}}
        handlePriceChange={() => {}}
        removeZonePrice={() => {}}
        addZonePrice={() => {}}
        ticketTypes={ticketTypes}
        viewLogEventPrices={viewLogEventPrices}
      />
      {expandedZones[Plan_Id] ? (
        <Button
          color="success"
          variant="contained"
          className={styles.saveButtonContainer}
        >
          บันทึกข้อมูล
        </Button>
      ) : null}
    </div>
  );
};

export default Plan;
