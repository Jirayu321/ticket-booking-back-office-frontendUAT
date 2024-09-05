import { Stack } from "@mui/material";
import { FC, useState } from "react";
import { useEditZonePriceStore } from "../_hook/useEditZonePriceStore";
import Plan from "./Plan";

type PlanListProps = {
  plans: any[];
};

const PlanList: FC<PlanListProps> = ({ plans }) => {
  const { setZoneData } = useEditZonePriceStore();
  const [expandedZones, setExpandedZones] = useState<{
    [key: string]: boolean;
  }>({});

  const handleExpandZone = (zoneId: number, zoneName: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId],
    }));

    if (!plans[zoneId]) {
      setZoneData(zoneId, {
        ticketType: "",
        seatCount: 0,
        seatPerTicket: 0,
        prices: [],
        tableInputMethod: "1",
      });
    }
    setZoneData(zoneId, { zoneName });
  };

  return (
    <Stack
      sx={{
        marginY: 2,
      }}
      gap={1}
    >
      {plans.map((plan) =>
        Boolean(plan) ? (
          <Plan
            key={plan.Plan_id}
            plans={plans}
            plan={plan}
            onExpand={handleExpandZone}
            expandedZones={expandedZones}
          />
        ) : null
      )}
    </Stack>
  );
};

export default PlanList;
