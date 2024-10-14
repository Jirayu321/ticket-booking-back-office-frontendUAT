import { CircularProgress } from "@mui/material";
import { FC } from "react";
import Select from "../../../components/common/input/date-picker/Select";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import { useFetchViewEventStocks } from "../../../hooks/fetch-data/useFetchViewEventStocks";
import { useEditZonePriceStore } from "../_hook/useEditZonePriceStore";
import { useSyncPlanGroup } from "../_hook/useSyncPlanGroup";
import styles from "./edit-zone-price-form.module.css";
import PlanList from "./PlanList";

type EditZonePriceFormProp = {
  eventId: number;
};

const EditZonePriceForm: FC<EditZonePriceFormProp> = ({ eventId }) => {
  const { selectedPlanGroupId, setSelectedPlanGroupId } =
    useEditZonePriceStore();

  const { data: planGroups, isPending: isLoadingPlanGroups } =
    useFetchPlanGroups();

  const { data: viewEventStocks, isPending: isLoadingViewEventStocks } =
    useFetchViewEventStocks({ eventId });

  const filteredPlans = viewEventStocks?.filter(
    (plan: any) => plan.PlanGroup_Id === selectedPlanGroupId
  );

  console.log("filteredPlans", filteredPlans);

  useSyncPlanGroup(viewEventStocks);

  if (isLoadingPlanGroups || isLoadingViewEventStocks)
    return <CircularProgress />;

  return (
    <div className={styles.container}>
      {planGroups ? (
        <Select
          options={planGroups?.map((pg: any) => pg.PlanGroup_Name)}
          optionValues={planGroups?.map((pg: any) => pg.PlanGroup_id)}
          value={selectedPlanGroupId}
          setter={setSelectedPlanGroupId}
          disabled={true}
          placeholder="เลือกผังร้าน"
        />
      ) : null}
      <PlanList plans={filteredPlans} />
    </div>
  );
};

export default EditZonePriceForm;
