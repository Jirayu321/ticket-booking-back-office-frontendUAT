import { create } from "zustand";
import { ZoneData } from "../type";

type EditZonePriceStore = {
  selectedPlanGroupId: string | null;
  setSelectedPlanGroupId: (newValue: string) => void;
  zones: Record<number, ZoneData>;
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
};

export const useEditZonePriceStore = create<EditZonePriceStore>((set) => ({
  selectedPlanGroupId: null,
  setSelectedPlanGroupId: (newValue: string) =>
    set({ selectedPlanGroupId: newValue }),
  zones: {},
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
      selectedPlanGroupId: null,
      zones: {},
    }),
}));
