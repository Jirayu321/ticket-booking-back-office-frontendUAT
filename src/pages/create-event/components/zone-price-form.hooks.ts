import {
  convertLocalTimeToISO,
  doesSomeItemDuplicateInMultipleArrays,
} from "../../../lib/util";
import { createEvent } from "../../../services/event-list.service";
import { createEventStock } from "../../../services/event-stock.service";
import { createLogEventPrice } from "../../../services/log-event-price.service";
import { createTicketNoPerPlan } from "../../../services/ticket-no-per-plan.service";
import { useEventStore, useZoneStore } from "../form-store";

const DEFAULT_INPUT_METHOD = 1;
const DEFAULT_ACTIONER = "admin";
const MINIMUM_EVENT_IMAGES = 1;

export function useZonePriceForm() {
  const { title, title2, description, eventDateTime, status } = useEventStore();

  const { selectedZoneGroup, zones } = useZoneStore();

  const handleCreateEvent = async () => {
    if (!eventDateTime) {
      throw new Error("กรุณาเลือกวันจัดงานก่อนทำการสร้าง event");
    }

    try {
      const { images } = useEventStore.getState();

      if (
        images.filter((image) => image !== null).length < MINIMUM_EVENT_IMAGES
      ) {
        throw new Error(
          `กรุณาอัปโหลดภาพ event อย่างน้อย ${MINIMUM_EVENT_IMAGES} รูป`
        );
      }

      const eventData = {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Date: convertLocalTimeToISO(eventDateTime),
        Event_Time: convertLocalTimeToISO(eventDateTime),
        Event_Status: status,
        Event_Public: "N",
        Event_Pic_1: images[0] || null,
        Event_Pic_2: images[1] || null,
        Event_Pic_3: images[2] || null,
        Event_Pic_4: images[3] || null,
      };

      const { eventId } = await createEvent(eventData);

      return eventId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleSaveEventStock = async (event_id: number) => {
    try {
      const zoneDataArray = Object.entries(zones)
        .filter(([zoneId, zoneData]) => {
          if (!zoneData.ticketType || zoneData.ticketType === "") {
            return false;
          }
          if (zoneData.seatCount <= 0) {
            return false;
          }

          if (!zoneData.seatPerTicket || zoneData.seatPerTicket <= 0) {
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
          STC_Total_Balance: Number(
            zoneData.seatCount * zoneData.seatPerTicket
          ),
          Created_By: DEFAULT_ACTIONER,
        }));

      if (zoneDataArray.length === 0) {
        throw new Error(
          "ข้อผิดพลาดในการตรวจสอบ: ข้อมูลโซนที่ขาดหายไปหรือไม่ถูกต้อง"
        );
      }

      await Promise.all(zoneDataArray.map((data) => createEventStock(data)));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleSaveLogEventPrice = async (event_id: number) => {
    try {
      const logPrices = Object.entries(zones)
        .map(([zoneId, zoneData]) => {
          return (
            zoneData?.prices?.map((price) => ({
              Event_Id: event_id,
              PlanGroup_Id: selectedZoneGroup!,
              Plan_Id: parseInt(zoneId),
              Plan_Price: Number(price.price),
              Start_Datetime: price.startDate!,
              End_Datetime: price.endDate!,
              Created_Date: new Date().toISOString(),
              Created_By: DEFAULT_ACTIONER,
            })) ?? null
          );
        })
        .filter((plan) => plan !== null)
        .flat();

      if (logPrices.length === 0) {
        throw new Error("กรุณาเลือกราคาสำหรับ Event");
      }

      await Promise.all(
        logPrices.map((logPrice) => createLogEventPrice(logPrice))
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleSaveTicketNumbers = async (eventId: number) => {
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
      await Promise.all(
        ticketNumberData.map(async (ticket) => {
          const { PlanGroup_Id, Plan_Id, Line, Ticket_No, Ticket_No_Option } =
            ticket!;
          await createTicketNoPerPlan({
            Event_Id: eventId,
            PlanGroup_Id,
            Plan_Id,
            Line,
            Ticket_No,
            Ticket_No_Option,
          });
        })
      );
    } catch (error) {
      throw new Error("ล้มเหลวระหว่างสร้างเลขตั๋ว");
    }
  };

  function isFormValid(): { isValid: boolean; message: string } {
    if (!eventDateTime) {
      return {
        isValid: false,
        message: "กรุณาเลือกวันจัดงานก่อนทำการสร้าง event",
      };
    }

    const allTableValues = Object.entries(zones)
      .map(([_, zone]) => {
        return zone.tableValues ?? [];
      })
      .flat();

    if (doesSomeItemDuplicateInMultipleArrays<string>(allTableValues)) {
      throw new Error("มีเลขตั๋วซ้ำกันในโซนต่างๆ");
    }

    const isSomeTicketNumberEmpty = Object.entries(zones).some(
      ([_, zoneData]) => {
        return (
          (zoneData.tableValues?.some((value) => value === "") &&
            zoneData.tableInputMethod !== "5") ??
          false
        );
      }
    );

    if (isSomeTicketNumberEmpty) {
      throw new Error("กรุณากรอกเลขตั๋วสำหรับโซนทั้งหมด");
    }

    const isTicketTypeEmpty = Object.entries(zones).some(
      ([_, zoneData]) => !zoneData.ticketType || zoneData.ticketType === ""
    );

    const isSeatCountInvalid = Object.entries(zones).some(([_, zoneData]) => {
      return (
        zoneData.seatCount <= 0 && Object.keys(zoneData).includes("tableValues")
      );
    });

    const isSeatPerTicketInvalid = Object.entries(zones).some(
      ([_, zoneData]) => {
        return (
          (!zoneData.seatPerTicket || zoneData.seatPerTicket <= 0) &&
          Object.keys(zoneData).includes("tableValues")
        );
      }
    );

    if (isTicketTypeEmpty) {
      throw new Error("ต้องระบุประเภทตั๋วสำหรับโซนทั้งหมด");
    }

    if (isSeatCountInvalid) {
      throw new Error("จำนวนที่นั่งต้องมากกว่า 0 สำหรับโซนทั้งหมด");
    }

    if (isSeatPerTicketInvalid) {
      throw new Error("จำนวนที่นั่งต่อตั๋วต้องมากกว่า 0 สำหรับโซนทั้งหมด");
    }

    const zoneDataArray = Object.entries(zones).filter(([_, zoneData]) => {
      if (!Object.keys(zoneData).includes("seatPerTicket")) return true;
      if (!zoneData.ticketType || zoneData.ticketType === "") {
        throw new Error("กรุณากรอกประเภทของตั๋วสำหรับโซนทั้งหมด");
      }
      if (zoneData.seatCount <= 0) {
        throw new Error("กรุณากรอกจำนวนที่นั่งสำหรับโซนทั้งหมด");
      }
      if (!zoneData.seatPerTicket || zoneData.seatPerTicket <= 0) {
        throw new Error("กรุณากรอกจำนวนที่นั่งต่อตั๋วสำหรับโซนทั้งหมด");
      }
      return true;
    });

    if (zoneDataArray.length === 0) {
      return {
        isValid: false,
        message: "ข้อผิดพลาดในการตรวจสอบ: ข้อมูลโซนที่ไม่ถูกต้องหรือขาดหายไป",
      };
    }

    const logPrices = Object.entries(zones)
      .map(([_, zoneData]) => zoneData.prices)
      .filter((value) => Boolean(value))
      .flat();

    const doesNotHavePrice = logPrices.some((lp: any) => lp.price <= 0);

    if (doesNotHavePrice) {
      return {
        isValid: false,
        message: "ราคา ของ event ต้องมีค่ามากกว่า 0",
      };
    }

    const doesHaveEmptyLogEventPrice = Object.entries(zones)
      .map(([_, zoneData]) => {
        const isRealZoneData = Object.keys(zoneData).includes("tableValues");

        if (isRealZoneData) {
          return zoneData.prices.length <= 0;
        } else {
          return false;
        }
      })
      .some((value: any) => value === true);

    if (doesHaveEmptyLogEventPrice) {
      return {
        isValid: false,
        message: "ควรมีช่วงราคาอย่างน้อย 1 ช่วงสำหรับแต่ละโซน",
      };
    }

    const doesHaveEmptyStartDateOrEndDate = logPrices.some(
      (lp: any) => !lp.startDate || !lp.endDate
    );

    if (doesHaveEmptyStartDateOrEndDate) {
      return {
        isValid: false,
        message: "กรุณากรอกวันเวลาเริ่มต้นและสิ้นสุดของราคา",
      };
    }

    return { isValid: true, message: "" };
  }

  return {
    handleCreateEvent,
    handleSaveEventStock,
    handleSaveLogEventPrice,
    handleSaveTicketNumbers,
    isFormValid,
  };
}
