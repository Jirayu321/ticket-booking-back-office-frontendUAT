import { postEvent, postEventStock, postLogEventPrice, postTicketNumber } from '../../../services/apiService'; 
import { useEventStore } from '../form-store'; 
import { useZoneStore } from '../form-store';

export const handleSave = async () => {
  try {
    // Step 1: Save the event and get the event_id
    const event_id = await handleSaveEvent();
    if (!event_id) throw new Error("Failed to save event");

    // Step 2: Save event stock
    await handleSaveEventStock(event_id);

    // Step 3: Save log event price
    await handleSaveLogEventPrice(event_id);

    // Step 4: Save ticket numbers
    await handleSaveTicketNumbers();

    console.log("All data saved successfully!");
  } catch (error) {
    console.error("Failed to save all data:", error);
  }
};

const handleSaveEvent = async () => {
  const { title, title2, description, eventDateTime, status } = useEventStore.getState();

  const eventData = {
    Event_Name: title,
    Event_Addr: title2,
    Event_Desc: description,
    Event_Date: eventDateTime.format('YYYY-MM-DD'),
    Event_Time: eventDateTime.format('HH:mm:ss'),
    Event_Status: status,
    Event_Public: 'N', // Default to 'N' as in your request
  };

  try {
    const response = await postEvent(eventData);
    return response.event_id; // Assuming the API returns event_id in the response
  } catch (error) {
    console.error("Failed to save event:", error);
  }
};

const handleSaveEventStock = async (event_id: number) => {
  const { selectedZoneGroup, zones } = useZoneStore.getState();

  const zoneDataArray = Object.entries(zones)
    .filter(([zoneId, zoneData]) => {
      if (!zoneData.ticketType || zoneData.ticketType === "") {
        console.error(`Validation Error: ticketType is required for zone ${zoneId}`);
        return false;
      }
      if (zoneData.seatCount <= 0) {
        console.error(`Validation Error: seatCount must be greater than 0 for zone ${zoneId}`);
        return false;
      }
      if (!zoneData.seatPerTicket || zoneData.seatPerTicket <= 0) {
        console.error(`Validation Error: seatPerTicket is required and must be greater than 0 for zone ${zoneId}`);
        return false;
      }
      return true;
    })
    .map(([zoneId, zoneData]) => ({
      event_id,
      plangroup_id: selectedZoneGroup,
      plan_id: parseInt(zoneId),
      ticket_type_id: zoneData.ticketType,
      ticket_qty: zoneData.seatCount,
      ticket_qty_per: zoneData.seatPerTicket,
      stc_total: zoneData.seatCount * zoneData.seatPerTicket,
      ticket_qty_buy: 0,
      ticket_qty_balance: zoneData.seatCount,
      stc_total_balance: zoneData.seatCount * zoneData.seatPerTicket,
      created_by: 'admin',
      updated_by: ''
    }));

  if (zoneDataArray.length === 0) {
    console.error("Validation Error: No valid zone data to save.");
    throw new Error("Validation Error: Missing or invalid zone data.");
  }

  try {
    await Promise.all(zoneDataArray.map(data => postEventStock(data)));
    console.log("Event stock saved successfully!");
  } catch (error) {
    console.error("Failed to save event stock:", error);
  }
};

const handleSaveLogEventPrice = async (event_id: number) => {
  const { selectedZoneGroup, zones } = useZoneStore.getState();

  const logPriceData = {
    eventId: event_id,
    plangroup_id: selectedZoneGroup,
    plans: Object.entries(zones)
      .map(([zoneId, zoneData]) => {
        if (!zoneData.prices || zoneData.prices.length === 0) {
          console.error(`Validation Error: Prices are required for zone ${zoneId}`);
          return null;
        }

        return {
          plan_id: parseInt(zoneId),
          prices: zoneData.prices.map(price => ({
            plan_price: price.price,
            start_datetime: price.startDate,
            end_datetime: price.endDate,
            created_by: 'admin', // Example value, replace with real user
          }))
        };
      })
      .filter(plan => plan !== null) // Filter out invalid plans
  };

  if (logPriceData.plans.length === 0) {
    console.error("Validation Error: No valid price data to save.");
    throw new Error("Validation Error: Missing or invalid price data.");
  }

  try {
    await postLogEventPrice(logPriceData);
    console.log("Log event prices saved successfully!");
  } catch (error) {
    console.error("Failed to save log event price:", error);
  }
};

const handleSaveTicketNumbers = async () => {
  const { selectedZoneGroup, zones } = useZoneStore.getState();

  const ticketNumberData = {
    plangroup_id: selectedZoneGroup,
    plans: Object.entries(zones).map(([zoneId, zoneData]) => ({
      plan_id: parseInt(zoneId),
      ticket_no_values: zoneData.tableValues?.length > 0 ? zoneData.tableValues : ['ไม่ระบุ'], // Handle "ไม่ระบุ"
      ticket_no_option: zoneData.tableInputMethod,
    }))
  };

  try {
    await postTicketNumber(ticketNumberData);
  } catch (error) {
    console.error("Failed to save ticket numbers:", error);
  }
};
