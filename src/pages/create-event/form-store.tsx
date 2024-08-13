import create from 'zustand';
import dayjs, { Dayjs } from 'dayjs';
// Event store
interface EventState {
  title: string;
  title2: string;
  description: string;
  eventDateTime: Dayjs | null;
  status: string;
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: Dayjs | null) => void;
  setStatus: (status: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: dayjs(new Date().toISOString()),
  status: "รอจัดงาน",
  setTitle: (title) => set({ title }),
  setTitle2: (title2) => set({ title2 }),
  setDescription: (description) => set({ description }),
  setEventDateTime: (eventDateTime) => set({ eventDateTime }),
  setStatus: (status) => set({ status }),
}));

// Zone store
interface ZoneData {
    ticketType: string;
    seatCount: number;
    seatPerTicket: number;
    prices: Price[];
    tableInputMethod: string;
    selectedZoneGroup: number | null;
    tableValues?: string[]; // Store table values
    startNumber?: number | null; // Add startNumber to store the start number
    prefix?: string; // Add prefix to store the prefix value
  }
  
  interface ZoneStoreState {
    selectedZoneGroup: number | null;
    zones: Record<number, ZoneData>;
    setSelectedZoneGroup: (groupId: number | null) => void;
    setZoneData: (zoneId: number, data: Partial<ZoneData>) => void;
    addZonePrice: (zoneId: number) => void;
    removeZonePrice: (zoneId: number, priceId: number) => void;
    setTableValues: (zoneId: number, values: string[]) => void; // Action to set table values
    setStartNumberAndPrefix: (zoneId: number, startNumber: number | null, prefix: string) => void; // New action
    resetZoneData: () => void;
  }
  
  export const useZoneStore = create<ZoneStoreState>((set) => ({
    selectedZoneGroup: null,
    zones: {},
  
    setSelectedZoneGroup: (groupId) =>
      set((state) => ({
        selectedZoneGroup: groupId,
        zones: {
          ...state.zones,
          [groupId]: {
            ...state.zones[groupId],
            selectedZoneGroup: groupId,
          },
        },
      })),
  
    setZoneData: (zoneId, data) =>
      set((state) => ({
        zones: {
          ...state.zones,
          [zoneId]: {
            ...state.zones[zoneId],
            ...data,
          },
        },
      })),
  
    addZonePrice: (zoneId) =>
      set((state) => ({
        zones: {
          ...state.zones,
          [zoneId]: {
            ...state.zones[zoneId],
            prices: [
              ...state.zones[zoneId].prices,
              {
                id: state.zones[zoneId].prices.length + 1,
                startDate: null,
                endDate: null,
                price: "",
              },
            ],
          },
        },
      })),
  
    removeZonePrice: (zoneId, priceId) =>
      set((state) => ({
        zones: {
          ...state.zones,
          [zoneId]: {
            ...state.zones[zoneId],
            prices: state.zones[zoneId].prices.filter(
              (price) => price.id !== priceId
            ),
          },
        },
      })),
  
    setTableValues: (zoneId, values) =>
      set((state) => ({
        zones: {
          ...state.zones,
          [zoneId]: {
            ...state.zones[zoneId],
            tableValues: values,
          },
        },
      })),
  
    setStartNumberAndPrefix: (zoneId, startNumber, prefix) =>
      set((state) => ({
        zones: {
          ...state.zones,
          [zoneId]: {
            ...state.zones[zoneId],
            startNumber,
            prefix,
          },
        },
      })),
  
    resetZoneData: () =>
      set({
        selectedZoneGroup: null,
        zones: {},
      }),
  }));