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
  ticketTypeId: number | null;
  ticketQtyPerPlan: number;
  seatQtyPerticket: number;
  logEventPrices: any[];
  ticketNumbers: string[];
};
