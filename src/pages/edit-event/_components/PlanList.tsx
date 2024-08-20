import { Stack } from "@mui/material";
import { FC, useState } from "react";
import Plan from "./Plan";

type PlanListProps = {
  plans: any[];
  onSetZoneData: any;
};

const PlanList: FC<PlanListProps> = ({ plans, onSetZoneData }) => {
  const [expandedZones, setExpandedZones] = useState<{
    [key: string]: boolean;
  }>({});

  const handleExpandZone = (zoneId: number, zoneName: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId],
    }));

    if (!plans[zoneId]) {
      onSetZoneData(zoneId, {
        ticketType: "",
        seatCount: 0,
        seatPerTicket: 0,
        prices: [],
        tableInputMethod: "1",
      });
    }
    onSetZoneData(zoneId, { zoneName });
  };

  return (
    <Stack className="w-full">
      {plans.map((plan) => (
        <Plan
          key={plan.Plan_id}
          plans={plans}
          plan={plan}
          onExpand={handleExpandZone}
          expandedZones={expandedZones}
        />
      ))}
    </Stack>
  );
};

export default PlanList;
