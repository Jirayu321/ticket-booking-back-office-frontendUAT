import { create } from "zustand";

type EditEventStore = {
  title: string;
  title2: string;
  description: string;
  eventDateTime: string;
  status: number;
  setTitle: (title: string) => void;
  setTitle2: (title2: string) => void;
  setDescription: (description: string) => void;
  setEventDateTime: (eventDateTime: string) => void;
  setStatus: (status: number) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  refreshEventInfo: (() => void) | null;
  setRefreshEventInfo: (refreshEventInfo: () => void) => void;
  isDetailCompleted: boolean;
  setIsDetailCompleted: (isDetailCompleted: boolean) => void;
  images: Array<string | null>; // Array to store base64 encoded images
  setImages: (index: number, image: string | null) => void;
  removeImage: (index: number) => void;
};

const useEditEventStore = create<EditEventStore>((set) => ({
  title: "",
  title2: "",
  description: "",
  eventDateTime: new Date().toISOString(), // Default to current ISO date
  status: 1,
  setTitle: (title) => set({ title }),
  setTitle2: (title2) => set({ title2 }),
  setDescription: (description) => set({ description }),
  
  // Ensure `eventDateTime` is properly set with ISO format
  setEventDateTime: (eventDateTime) => set({ eventDateTime }),

  setStatus: (status) => set({ status }),
  isPublic: false,
  setIsPublic: (isPublic) => set({ isPublic }),
  activeTab: "รายละเอียด",
  setActiveTab: (activeTab) => set({ activeTab }),
  refreshEventInfo: null,
  setRefreshEventInfo: (refreshEventInfo) => set({ refreshEventInfo }),
  isDetailCompleted: false,
  setIsDetailCompleted: (isDetailCompleted) => set({ isDetailCompleted }),

  // Image handling
  images: [null, null, null, null], // 4 image slots initially set to null
  setImages: (index, image) =>
    set((state) => {
      const updatedImages = [...state.images];
      updatedImages[index] = image;
      return { images: updatedImages };
    }),
  removeImage: (index) =>
    set((state) => {
      const updatedImages = [...state.images];
      updatedImages[index] = null;
      return { images: updatedImages };
    }),
}));

export default useEditEventStore;
