import { ChangeEvent, FC } from "react";

type ZoneSelectFormProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedZoneGroup: number | null;
  planGroups: any;
};

const ZoneSelectForm: FC<ZoneSelectFormProps> = ({
  onChange,
  selectedZoneGroup,
  planGroups,
}) => {
  return (
    <div style={{ paddingTop: "30px" }} className="form-section">
      <div className="zone-select-container">
        <label>เลือก ZONE GROUP</label>
        <select
          className="zone-select"
          onChange={onChange}
          value={selectedZoneGroup || ""}
        >
          <option value="">เลือกผังร้าน</option>
          {planGroups.map((group: any) => {
            const { PlanGroup_id, PlanGroup_Name } = group;
            return (
              <option key={PlanGroup_id} value={PlanGroup_id}>
                {PlanGroup_Name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default ZoneSelectForm;
