export type Price = {
  id: number;
  startDate: string | null;
  endDate: string | null;
  price: string;
};

export type ZoneData = {
  ticketType: string;
  seatCount: number;
  seatPerTicket: number;
  prices: Price[];
  tableInputMethod: string;
  tableValues?: string[];
  startNumber?: number | null;
  prefix?: string;
};

export type PlanInfo = {
  planId: number;
  ticketTypeId: number | null;
  ticketQtyPerPlan: number;
  seatQtyPerticket: number;
  logEventPrices: any[];
  ticketNumbers: string[];
};

export type TicketNoOption = "1" | "2" | "3" | "4" | "5" | "";