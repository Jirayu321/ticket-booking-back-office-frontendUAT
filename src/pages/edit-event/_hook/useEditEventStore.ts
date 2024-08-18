import { create } from "zustand";

type EditEventStore = {
  title: string;
  title2: string;
  description: string;
  eventDateTime: string;
  status: number; // Default status: "รอเริ่มงาน" (1)
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: string) => void;
  setStatus: (status: number) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
};

const useEditEventStore = create<EditEventStore>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: new Date().toISOString(),
  status: 1,
  setTitle: (title) => set({ title }),
  setTitle2: (title2) => set({ title2 }),
  setDescription: (description) => set({ description }),
  setEventDateTime: (eventDateTime) => set({ eventDateTime }),
  setStatus: (status) => set({ status }),
  isPublic: false,
  setIsPublic: (isPublic) => set({ isPublic }),
}));

export default useEditEventStore;
