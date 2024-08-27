import { CircularProgress } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useFetchTicketNoPerPlanByEventId } from "../../../hooks/fetch-data/useFetchTicketNoPerPlanByEventId";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import { PlanInfoProvider } from "../_hook/usePlanInfoStore";
import Body from "./Body";
import Header from "./Header";
import styles from "./plan.module.css";
import SaveButton from "./SaveButton";
import { v4 } from "uuid";

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

  const {
    data: viewLogEventPrices,
    isPending: isLoadingViewLogEventPrice,
    refetch: refreshViewEventStocks,
  } = useFetchViewLogEventPrice({
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

  if (isLoadingViewLogEventPrice || isLoadingTicketNoPerPlans)
    return <CircularProgress />;

  return (
    <PlanInfoProvider
      initialPlanInfo={{
        ticketTypeId: Ticket_Type_Id,
        ticketQtyPerPlan: Ticket_Qty_Per,
        seatQtyPerticket: Ticket_Qty,
        logEventPrices: viewLogEventPrices.map((vle: any) => ({
          id: v4(),
          ...vle,
        })),
        ticketNumbers: ticketNoPerPlans,
        planId: Number(Plan_Id),
      }}
    >
      <div className={styles.container}>
        <Header
          onExpand={onExpand}
          Plan_Id={Plan_Id}
          Plan_Name={Plan_Name}
          Plan_Desc={Plan_Desc}
        />
        <Body
          zones={plans}
          expandedZones={expandedZones}
          handleInputChange={() => {}}
          handlePriceChange={() => {}}
          removeZonePrice={() => {}}
        />
        {expandedZones[Plan_Id] ? (
          <SaveButton
            planId={Plan_Id}
            planGroupId={PlanGroup_Id}
            refreshViewEventStocks={refreshViewEventStocks}
          />
        ) : null}
      </div>
    </PlanInfoProvider>
  );
};

export default Plan;
