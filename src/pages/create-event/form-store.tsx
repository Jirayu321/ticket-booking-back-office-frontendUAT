import create from "zustand";

interface EventState {
  title: string;
  title2: string;
  description: string;
  eventDateTime: any;
  status: number;
  images: Array<string | null>; // Store images as an array
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: any) => void;
  setStatus: (status: number) => void;
  setImages: (index: number, image: string | null) => void; 
}

export const useEventStore = create<EventState>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: new Date(),
  status: 1,
  images: [null, null, null, null],
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
  inputValues: string[];
  startNumber: number;
}

export const useZoneStore = create<ZoneStoreState>((set) => ({
  selectedZoneGroup: null,
  zones: {},
  inputValues: [],
  startNumber: 1,
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

  addZonePrice: (zoneId) => {
    console.log("addZonePrice", zoneId); // ตรวจสอบค่า zoneId

    set((state) => ({
      zones: {
        ...state.zones,
        [zoneId]: {
          ...state.zones[zoneId],
          prices: [
            ...(state.zones[zoneId]?.prices || []), // ตรวจสอบว่ามี prices เป็น array หรือไม่ ถ้าไม่มีให้ใช้ array ว่าง
            {
              id: (state.zones[zoneId]?.prices?.length || 0) + 1,
              startDate: null,
              endDate: null,
              price: "",
            },
          ],
        },
      },
    }));
  },

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

  setInputValueStore: (inputValuesData) =>
    set({
      inputValues: inputValuesData,
    }),

  setStartNumber: (number) =>
    set({
      startNumber: number,
    }),
}));
