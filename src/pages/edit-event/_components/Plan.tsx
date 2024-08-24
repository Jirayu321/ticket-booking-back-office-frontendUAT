import { CircularProgress } from "@mui/material";
import { FC } from "react";
import styles from "./plan.module.css";
import { useParams } from "react-router-dom";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import Header from "./Header";
import Body from "./Body";

type PlanProps = {
  plan: any;
  plans: any[];
  onExpand: any;
  expandedZones: Record<string, boolean>;
};

const Plan: FC<PlanProps> = ({ plan, onExpand, plans, expandedZones }) => {
  const { eventId } = useParams();

  const { Plan_Id, Plan_Name, Plan_Desc, PlanGroup_Id } = plan;

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  const { data: viewLogEventPrices, isPending: isLoadingViewLogEventPrice } =
    useFetchViewLogEventPrice({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  if (isLoadingTicketTypes || isLoadingViewLogEventPrice)
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
    </div>
  );
};

export default Plan;
