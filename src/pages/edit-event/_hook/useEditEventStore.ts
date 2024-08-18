import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";

type EditEventStore = {
  title: string;
  title2: string;
  description: string;
  eventDateTime: Dayjs | null;
  status: number; // Default status: "รอเริ่มงาน" (1)
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: dayjs.Dayjs) => void;
  setStatus: (status: number) => void;
};

const useEditEventStore = create<EditEventStore>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: null,
  status: 1,
  setTitle: (title) => set({ title }),
  setTitle2: (title2) => set({ title2 }),
  setDescription: (description) => set({ description }),
  setEventDateTime: (eventDateTime) => set({ eventDateTime }),
  setStatus: (status) => set({ status }),
}));

export default useEditEventStore;
