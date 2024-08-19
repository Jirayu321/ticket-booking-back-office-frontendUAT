import { CircularProgress } from "@mui/material";
import { FC } from "react";
import Select from "../../../components/common/input/date-picker/Select";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import { useFetchViewEventStocks } from "../../../hooks/fetch-data/useFetchViewEventStocks";
import { useEditZonePriceStore } from "../_hook/useEditZonePriceStore";
import { useSyncPlanGroup } from "../_hook/useSyncPlanGroup";
import styles from "./edit-zone-price-form.module.css";

type EditZonePriceFormProp = {
  eventId: number;
};

const EditZonePriceForm: FC<EditZonePriceFormProp> = ({ eventId }) => {
  const { selectedPlanGroupName, setSelectedPlanGroupName } =
    useEditZonePriceStore();

  const { data: planGroups, isPending: isLoadingPlanGroups } =
    useFetchPlanGroups();

  const { data: viewEventStocks, isPending: isLoadingViewEventStocks } =
    useFetchViewEventStocks({ eventId });

  useSyncPlanGroup(viewEventStocks);

  if (isLoadingPlanGroups || isLoadingViewEventStocks)
    return <CircularProgress />;

  return (
    <div className={styles.container}>
      {/* {error && <div className="error-message">{error}</div>} */}
      {planGroups ? (
        <Select
          options={planGroups.map((pg: any) => pg.PlanGroup_Name)}
          value={selectedPlanGroupName}
          setter={setSelectedPlanGroupName}
          disabled={true}
          placeholder="เลือกผังร้าน"
        />
      ) : null}
      {/* <FilteredZones filteredZones={filteredZones} zones={zones} /> */}
      {/* <div className="save-form-section">
        <button className="buttonSave" onClick={handleSaveEvent}>
          บันทึก
        </button>
      </div> */}
    </div>
  );
};

export default EditZonePriceForm;
