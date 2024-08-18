import toast from "react-hot-toast";
import { createEvent } from "../../../services/event-list.service";
import { useEventStore, useZoneStore } from "../form-store";
import { createEventStock } from "../../../services/event-stock.service";
import { createLogEventPrice } from "../../../services/log-event-price.service";
import { createTicketNoPerPlan } from "../../../services/ticket-no-per-plan.service";

const DEFAULT_INPUT_METHOD = 1;

export function useZonePriceForm() {
  const { title, title2, description, eventDateTime, status } = useEventStore();
  const { selectedZoneGroup, zones } = useZoneStore();

  const handleCreateEvent = async () => {
    try {
      if (!eventDateTime || !eventDateTime)
        return toast.error("กรุณาเลือกวันจัดงานก่อนทำการสร้าง event");

      const eventData = {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Date: eventDateTime.format("YYYY-MM-DD"),
        Event_Time: eventDateTime.toDate().toISOString(),
        Event_Status: status,
        Event_Public: "N",
      };

      const { eventId } = await createEvent(eventData);

      return eventId;
    } catch (error) {
      throw new Error("ล้มเหลวระหว่างสร้าง event");
    }
  };

  const handleSaveEventStock = async (event_id: number) => {
    const zoneDataArray = Object.entries(zones)
      .filter(([zoneId, zoneData]) => {
        if (!zoneData.ticketType || zoneData.ticketType === "") {
          console.error(
            `Validation Error: ticketType is required for zone ${zoneId}`
          );
          return false;
        }
        if (zoneData.seatCount <= 0) {
          console.error(
            `Validation Error: seatCount must be greater than 0 for zone ${zoneId}`
          );
          return false;
        }
        if (!zoneData.seatPerTicket || zoneData.seatPerTicket <= 0) {
          console.error(
            `Validation Error: seatPerTicket is required and must be greater than 0 for zone ${zoneId}`
          );
          return false;
        }
        return true;
      })
      .map(([zoneId, zoneData]) => ({
        Event_Id: event_id,
        PlanGroup_Id: selectedZoneGroup!,
        Plan_Id: parseInt(zoneId),
        Ticket_Type_Id: Number(zoneData.ticketType),
        Ticket_Qty: Number(zoneData.seatCount),
        Ticket_Qty_Per: Number(zoneData.seatPerTicket),
        STC_Total: Number(zoneData.seatCount * zoneData.seatPerTicket),
        Ticket_Qty_Buy: 0,
        Ticket_Qty_Balance: Number(zoneData.seatCount),
        STC_Total_Balance: Number(zoneData.seatCount * zoneData.seatPerTicket),
        Created_By: "admin",
      }));

    if (zoneDataArray.length === 0) {
      console.error("Validation Error: No valid zone data to save.");
      throw new Error("Validation Error: Missing or invalid zone data.");
    }

    try {
      await Promise.all(zoneDataArray.map((data) => createEventStock(data)));
      console.log("Event stock saved successfully!");
    } catch (error) {
      throw "ล้มเหลวระหว่างสร้าง stock ของ event";
    }
  };

  const handleSaveLogEventPrice = async (event_id: number) => {
    const logPrices = Object.entries(zones)
      .map(([zoneId, zoneData]) => {
        if (!zoneData.prices || zoneData.prices.length === 0) {
          console.error(
            `Validation Error: Prices are required for zone ${zoneId}`
          );
          return null;
        }

        return zoneData.prices.map((price) => ({
          Event_Id: event_id,
          PlanGroup_Id: selectedZoneGroup!,
          Plan_Id: parseInt(zoneId),
          Plan_Price: Number(price.price),
          Start_Datetime: price.startDate!,
          End_Datetime: price.endDate!,
          Created_Date: new Date().toISOString(),
          Created_By: "admin",
        }));
      })
      .filter((plan) => plan !== null)
      .flat();

    if (logPrices.length === 0) {
      console.error("Validation Error: No valid price data to save.");
      throw new Error("Validation Error: Missing or invalid price data.");
    }

    try {
      await Promise.all(
        logPrices.map((logPrice) => createLogEventPrice(logPrice))
      );
    } catch (error) {
      throw "ล้มเหลวระหว่างสร้าง ราคา event";
    }
  };

  const handleSaveTicketNumbers = async () => {
    const ticketNumberData = Object.entries(zones)
      .flatMap(([zoneId, zoneData]) => {
        const ticketValues = zoneData.tableValues;

        if (!ticketValues) return null;

        return ticketValues.map((ticketValue, index) => ({
          PlanGroup_Id: Number(selectedZoneGroup!),
          Plan_Id: parseInt(zoneId),
          Line: index + 1,
          Ticket_No: ticketValue,
          Ticket_No_Option: Number(
            zoneData.tableInputMethod ?? DEFAULT_INPUT_METHOD
          ),
        }));
      })
      .filter((item) => item !== null);

    try {
      //   await Promise.all(
      //     ticketNumberData.map(async (ticket) => {
      //       const { PlanGroup_Id, Plan_Id, Line, Ticket_No, Ticket_No_Option } =
      //         ticket!;
      //       createTicketNoPerPlan({
      //         PlanGroup_Id,
      //         Plan_Id,
      //         Line,
      //         Ticket_No,
      //         Ticket_No_Option,
      //       });
      //     })
      //   );
      console.log(ticketNumberData);
    } catch (error) {
      throw "ล้มเหลวระหว่างสร้างเลขตั๋ว";
    }
  };

  return {
    handleCreateEvent,
    handleSaveEventStock,
    handleSaveLogEventPrice,
    handleSaveTicketNumbers,
  };
}
