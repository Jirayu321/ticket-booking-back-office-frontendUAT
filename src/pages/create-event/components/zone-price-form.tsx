import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import { getAllPlans } from "../../../services/plan.service";
import { useZoneStore } from "../form-store";
import FilteredZones from "./FilteredZones";
import "./zone-price-form.css";
import { useZonePriceForm } from "./zone-price-form.hooks";
import ZoneSelectForm from "./ZoneSelectForm";
import { SwalError, SwalSuccess } from "../../../lib/sweetalert";
import { getAllTicketNoPerPlan } from "../../../services/ticket-no-per-plan.service";
import { set } from "react-hook-form";

const ZonePriceForm = () => {
  const {
    selectedZoneGroup,
    setSelectedZoneGroup,
    setZoneData,
    resetZoneData,
  } = useZoneStore();

  const {
    handleCreateEvent,
    handleSaveEventStock,
    handleSaveLogEventPrice,
    handleSaveTicketNumbers,
    isFormValid,
  } = useZonePriceForm();

  const navigate = useNavigate();

  const { data: planGroups, isPending: isLoadingPlanGroups } =
    useFetchPlanGroups();

  const [filteredZones, setFilteredZones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [joinData, setJoinData] = useState<any[]>([]);

  console.log("joinData =>", joinData);
  console.log("filteredZones =>", filteredZones);

  const handlePlanGroupChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPlanGroupId = parseInt(event.target.value);

    console.log("newPlanGroupId =>", newPlanGroupId);

    resetZoneData();

    setSelectedZoneGroup(newPlanGroupId);

    forceRefreshFilteredZones(newPlanGroupId);

    setZoneData(newPlanGroupId, { ticketType: "1" }); // Set default ticket type
  };

  const TicketNoPerPlanJoinData = async (newPlanGroupId: number) => {
    try {
      const res = await getAllTicketNoPerPlan({ newPlanGroupId });
      setJoinData(res);
      console.log("res =>", res);
    } catch (error) {
      console.error("Error fetching TicketNoPerPlanJoinData:", error);
      setError(
        "Failed to fetch TicketNoPerPlanJoinData. Please try again later."
      );
    }
  };

  // const forceRefreshFilteredZones = async (groupId: number) => {
  //   try {
  //     const fetchedViewPlans = (await getAllPlans()).plans;
  //     const newFilteredZones = fetchedViewPlans.filter(
  //       (plan: any) => plan.PlanGroup_id === groupId
  //     );

  //     const ticketNoPerPlanJoinData = await getAllTicketNoPerPlan({
  //       newPlanGroupId: groupId,
  //     });

  //     const combinedZones = newFilteredZones.map((zone) => {
  //       const joinData = ticketNoPerPlanJoinData.find(
  //         (data) => data.PlanGroup_Id === groupId
  //       );
  //       return { ...zone, ...joinData };
  //     });

  //     setFilteredZones(combinedZones);
  //   } catch (error) {
  //     console.error("Error refreshing filtered zones:", error);
  //     setError("Failed to refresh zones. Please try again later.");
  //   }
  // };

  const forceRefreshFilteredZones = async (groupId: number) => {
    try {
      const fetchedViewPlans = (await getAllPlans()).plans;
      console.log("Fetched Plans =>", fetchedViewPlans);

      const newFilteredZones = fetchedViewPlans.filter(
        (plan: any) => plan.PlanGroup_id === groupId
      );
      console.log("Filtered Zones =>", newFilteredZones);

      const ticketNoPerPlanJoinData = await getAllTicketNoPerPlan({
        newPlanGroupId: groupId,
      });
      console.log("Ticket Data =>", ticketNoPerPlanJoinData);

      // ตรวจสอบ Plan_Id
      // console.log(
      //   "New Filtered Zones Plan_Id =>",
      //   newFilteredZones.map((zone) => zone.Plan_id)
      // );
      // console.log(
      //   "Ticket Plan_Id =>",
      //   ticketNoPerPlanJoinData.map((data) => data.Plan_Id)
      // );
      // ตรวจสอบว่า Plan_id ของ newFilteredZones มีการจับคู่กับ Plan_Id ใน ticketNoPerPlanJoinData หรือไม่
      const combinedZones = newFilteredZones.map((zone) => {
        const joinData = ticketNoPerPlanJoinData
          .filter((data) => data.Plan_Id === zone.Plan_id) // ใช้ zone.Plan_id
          .map(({ Line, Ticket_No, Ticket_No_Option }) => ({
            Line,
            Ticket_No,
            Ticket_No_Option,
          }));

        return { ...zone, ticketNoPlanList: joinData };
      });

      console.log("Combined Zones =>", combinedZones);
      setFilteredZones(combinedZones);
    } catch (error) {
      console.error("Error refreshing filtered zones:", error);
      setError("Failed to refresh zones. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedViewPlans = (await getAllPlans()).plans;
        console.log("Fetched plans:", fetchedViewPlans);

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
    TicketNoPerPlanJoinData();
    fetchData();
  }, []);

  async function handleSaveEvent() {
    try {
      toast.loading("กำลังบันทึกข้อมูล Event");

      const { isValid, message } = isFormValid();

      if (!isValid) throw new Error(message);

      const eventId = await handleCreateEvent();

      if (!eventId) {
        toast.dismiss();
        throw new Error("ล้มเหลวระหว่างสร้าง event");
      }

      await handleSaveEventStock(eventId);

      await handleSaveLogEventPrice(eventId);

      await handleSaveTicketNumbers(eventId);

      toast.dismiss();

      SwalSuccess("บันทึกข้อมูล Event สำเร็จ");

      navigate("/all-events");
    } catch (error: any) {
      toast.dismiss();
      SwalError(error.message);
    }
  }

  if (isLoadingPlanGroups) return <CircularProgress />;

  return (
    <div
      style={{ display: "grid", height: "80%", alignContent: "space-between" }}
    >
      <div className="zone-price-form-container">
        {error && <div className="error-message">{error}</div>}
        <ZoneSelectForm
          onChange={handlePlanGroupChange}
          selectedZoneGroup={selectedZoneGroup}
          planGroups={planGroups}
        />
        <FilteredZones filteredZones={filteredZones} />
      </div>
      <div
        className="next-form-section"
        style={{ position: "relative", height: "50px" }}
      >
        <button
          className="buttonNext"
          style={{
            width: "110px",
            borderRadius: "inherit",
            marginTop: "0px",
          }}
          // onClick={handleBackClick}
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
};

export default ZonePriceForm;
