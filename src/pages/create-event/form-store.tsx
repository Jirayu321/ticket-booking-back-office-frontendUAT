import create from "zustand";
import { addHours, formatISOToLocalTime } from "../../lib/util";

// Event store interface and Zustand implementation
interface EventState {
  title: string;
  title2: string;
  description: string;
  eventDateTime: string;
  status: number;
  images: Array<string | null>; // Store images as an array
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: string) => void;
  setStatus: (status: number) => void;
  setImages: (index: number, image: string | null) => void; // Action to set images
}

export const useEventStore = create<EventState>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: addHours(new Date(), 7).toISOString(),
  status: 1,
  images: [null, null, null, null], // Initialize with 4 image placeholders
  setTitle: (title) => set({ title }),
  setTitle2: (title2) => set({ title2 }),
  setDescription: (description) => set({ description }),
  setEventDateTime: (eventDateTime) => set({ eventDateTime }),
  setStatus: (status) => set({ status }),
  setImages: (index, image) =>
    set((state) => {
      const updatedImages = [...state.images];
      updatedImages[index] = image;
      return { images: updatedImages };
    }),
}));

// Zone store interface and Zustand implementation
interface Price {
  id: number;
  startDate: string | null;
  endDate: string | null;
  price: string;
}

interface ZoneData {
  ticketType: string;
  seatCount: number;
  seatPerTicket: number;
  prices: Price[];
  tableInputMethod: string;
  tableValues?: string[]; // Optional: Store table values
  startNumber?: number | null; // Optional: Store the start number
  prefix?: string; // Optional: Store the prefix value
}

interface ZoneStoreState {
  selectedZoneGroup: number | null;
  zones: Record<number, ZoneData>;
  setSelectedZoneGroup: (groupId: number | null) => void;
  setZoneData: (zoneId: number, data: Partial<ZoneData>) => void;
  addZonePrice: (zoneId: number) => void;
  removeZonePrice: (zoneId: number, priceId: number) => void;
  setTableValues: (zoneId: number, values: string[]) => void; // Action to set table values
  setStartNumberAndPrefix: (
    zoneId: number,
    startNumber: number | null,
    prefix: string
  ) => void; // Action to set start number and prefix
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
