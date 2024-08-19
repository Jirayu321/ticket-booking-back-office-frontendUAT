import create from "zustand";

type EditZonePriceStore = {
  selectedPlanGroupName: string | null;
  setSelectedPlanGroupName: (newValue: string) => void;
};

export const useEditZonePriceStore = create<EditZonePriceStore>((set) => ({
  selectedPlanGroupName: null,
  setSelectedPlanGroupName: (newValue: string) =>
    set({ selectedPlanGroupName: newValue }),
}));
