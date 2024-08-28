import { createContext, FC, ReactNode, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

type PlanInfoStoreContextProps = StoreApi<unknown>;

export const PlanInfoStoreContext =
  createContext<PlanInfoStoreContextProps | null>(null);

type Props = {
  children: ReactNode;
  initialPlanInfo: any;
};

export const PlanInfoProvider: FC<Props> = ({ children, initialPlanInfo }) => {
  const [store] = useState(() =>
    createStore((set) => ({
      ...initialPlanInfo,
      onUpdatePlanInfo: (newPlanInfo: any) => set((_: any) => newPlanInfo),
      onAddLogEventPrice: (newLogEventPrice: any) =>
        set((state: any) => ({
          ...state,
          logEventPrices: [...state.logEventPrices, newLogEventPrice],
        })),
      onUpdateLogEventPrice: (newLogEventPrice: any) =>
        set((state: any) => {
          console.log(newLogEventPrice);
          const updatedLogEventPrices = state.logEventPrices.map(
            (logEventPrice: any) =>
              logEventPrice.id === newLogEventPrice.id
                ? newLogEventPrice
                : logEventPrice
          );
          return {
            ...state,
            logEventPrices: updatedLogEventPrices,
          };
        }),
      onUpdatePrice: (newPrice: number, logEventPriceId: string) =>
        set((state: any) => {
          const updatedLogEventPrices = state.logEventPrices.map(
            (logEventPrice: any) =>
              logEventPrice.id === logEventPriceId
                ? { ...logEventPrice, Plan_Price: newPrice }
                : logEventPrice
          );
          return {
            ...state,
            logEventPrices: updatedLogEventPrices,
          };
        }),
      onDeleteLogEventPrice: (logEventPriceId: string) =>
        set((state: any) => ({
          ...state,
          logEventPrices: state.logEventPrices.filter(
            (logEventPrice: any) => logEventPrice.id !== logEventPriceId
          ),
        })),
    }))
  );

  return (
    <PlanInfoStoreContext.Provider value={store}>
      {children}
    </PlanInfoStoreContext.Provider>
  );
};

const usePlanInfoStore = (selector: any) => {
  const store = useContext(PlanInfoStoreContext);
  if (!store) {
    throw new Error("Missing PlaninfoStoreContext");
  }
  return useStore(store, selector) as any;
};

export default usePlanInfoStore;
