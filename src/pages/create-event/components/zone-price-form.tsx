import { CircularProgress } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import { getAllPlans } from "../../../services/plan.service";
import { useZoneStore } from "../form-store";
import FilteredZones from "./FilteredZones";
import "./zone-price-form.css";
import ZoneSelectForm from "./ZoneSelectForm";

type Props = {
  onSaveEvent: () => void;
};

const ZonePriceForm: FC<Props> = ({ onSaveEvent }) => {
  const {
    selectedZoneGroup,
    setSelectedZoneGroup,
    setZoneData,
    resetZoneData,
  } = useZoneStore();

  const { data: planGroups, isPending: isLoadingPlanGroups } =
    useFetchPlanGroups();

  const [filteredZones, setFilteredZones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePlanGroupChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPlanGroupId = parseInt(event.target.value);

    resetZoneData();

    setSelectedZoneGroup(newPlanGroupId);

    forceRefreshFilteredZones(newPlanGroupId);

    setZoneData(newPlanGroupId, { ticketType: "1" }); // Set default ticket type
  };

  const forceRefreshFilteredZones = async (groupId: number) => {
    try {
      const fetchedViewPlans = (await getAllPlans()).plans;
      const newFilteredZones = fetchedViewPlans.filter(
        (plan: any) => plan.PlanGroup_id === groupId
      );
      setFilteredZones(newFilteredZones);
    } catch (error) {
      console.error("Error refreshing filtered zones:", error);
      setError("Failed to refresh zones. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedViewPlans = (await getAllPlans()).plans;

        if (!Array.isArray(fetchedViewPlans)) {
          throw new Error("Expected an array but received something else");
        }

        const planGroupMap = new Map();
        fetchedViewPlans.forEach((plan) => {
          const { PlanGroup_Id, PlanGroup_Name } = plan;
          if (plan.plangroup_id && !planGroupMap.has(PlanGroup_Id)) {
            planGroupMap.set(PlanGroup_Id, {
              plangroup_id: PlanGroup_Id,
              plangroup_name: PlanGroup_Name,
            });
          }
        });

        const derivedPlanGroups = Array.from(planGroupMap.values());

        if (derivedPlanGroups.length > 0) {
          const firstGroupId = derivedPlanGroups[0].plangroup_id;
          if (firstGroupId !== undefined) {
            setSelectedZoneGroup(firstGroupId);
            const initialFilteredZones = fetchedViewPlans.filter(
              (plan) => plan.plangroup_id === firstGroupId
            );
            setFilteredZones(initialFilteredZones);
          } else {
            console.error("First plan group does not have a plangroup_id");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (isLoadingPlanGroups) return <CircularProgress />;

  return (
    <div className="zone-price-form-container">
      {error && <div className="error-message">{error}</div>}
      <ZoneSelectForm
        onChange={handlePlanGroupChange}
        selectedZoneGroup={selectedZoneGroup}
        planGroups={planGroups}
      />
      <FilteredZones filteredZones={filteredZones} />
      <div className="save-form-section">
        <button className="buttonSave" onClick={onSaveEvent}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default ZonePriceForm;
