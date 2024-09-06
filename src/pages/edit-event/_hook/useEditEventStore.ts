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
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  refreshEventInfo: (() => void) | null;
  setRefreshEventInfo: (refreshEventInfo: () => void) => void;
  isDetailCompleted: boolean;
  setIsDetailCompleted: (isDetailCompleted: boolean) => void;
  images: Array<string | null>; // Array to store base64 encoded images
  setImages: (index: number, image: string | null) => void;
  removeImage: (index: number) => void;
  Event_Pic_1: string | null;
  Event_Pic_2: string | null;
  Event_Pic_3: string | null;
  Event_Pic_4: string | null;
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

  // Event_Pic properties
  Event_Pic_1: null, // Mapping first image to Event_Pic_1
  Event_Pic_2: null, // Mapping second image to Event_Pic_2
  Event_Pic_3: null, // Mapping third image to Event_Pic_3
  Event_Pic_4: null, // Mapping fourth image to Event_Pic_4
}));

// Sync Event_Pic with images
useEditEventStore.subscribe(
  (state) => ({
    Event_Pic_1: state.images[0],
    Event_Pic_2: state.images[1],
    Event_Pic_3: state.images[2],
    Event_Pic_4: state.images[3],
  }),
  (images) =>
    set(() => ({
      Event_Pic_1: images[0],
      Event_Pic_2: images[1],
      Event_Pic_3: images[2],
      Event_Pic_4: images[3],
    }))
);

export default useEditEventStore;
