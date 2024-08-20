import { FC } from "react";
import styles from "./plan.module.css";
// import GenerateBoxes from "./GenerateBoxes";
import { Collapse } from "@mui/material";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

type PlanProps = {
  plan: any;
  plans: any[];
  onExpand: any;
  expandedZones: Record<string, boolean>;
};

const Plan: FC<PlanProps> = ({ plan, onExpand, plans, expandedZones }) => {
  const { Plan_id, Plan_Name, Plan_Desc } = plan;
  return (
    <div className={styles.planContainer}>
      <Header
        onExpand={onExpand}
        Plan_id={Plan_id}
        Plan_Name={Plan_Name}
        Plan_Desc={Plan_Desc}
      />
      <Body
        zone={plan}
        zones={plans}
        expandedZones={expandedZones}
        handleInputChange={() => {}}
        handlePriceChange={() => {}}
        removeZonePrice={() => {}}
        addZonePrice={() => {}}
        ticketTypes={[]}
        columns={[]}
      />
    </div>
  );
};

type HeaderProps = {
  onExpand: any;
  Plan_id: number;
  Plan_Name: string;
  Plan_Desc: string;
};

const Header: FC<HeaderProps> = ({
  onExpand,
  Plan_id,
  Plan_Name,
  Plan_Desc,
}) => {
  return (
    <header
      onClick={() => onExpand(Plan_id, Plan_Name)}
      className={styles.header}
    >
      <h4>
        {Plan_id}. {Plan_Name}
      </h4>
      <h4>{Plan_Desc}</h4>
    </header>
  );
};

type BodyProps = {
  zone: any;
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  handlePriceChange: any;
  removeZonePrice: any;
  addZonePrice: any;
  ticketTypes: any;
  columns: any;
};

const Body: FC<BodyProps> = ({
  zone,
  zones,
  expandedZones,
  handleInputChange,
  handlePriceChange,
  removeZonePrice,
  addZonePrice,
  ticketTypes,
  columns,
}) => {
  return (
    <Collapse in={expandedZones[zone.Plan_id]} timeout="auto" unmountOnExit>
      <div className="zone-content">
        <div className="ticket-layout">
          <div className="empty-image">
            <span>Image Placeholder</span>
          </div>
          <div className="ticket-details">
            <div className="ticket-type">
              <label>TICKET TYPE*</label>
              <select
                className="ticket-type-select"
                value={zones[zone.Plan_id]?.ticketType || ""}
                onChange={(e) =>
                  handleInputChange(zone.Plan_id, "ticketType", e.target.value)
                }
              >
                <option value="">เลือกประเภทตั๋ว</option>
                {ticketTypes?.map((type: any) => (
                  <option key={type.Ticket_Type_Id} value={type.Ticket_Type_Id}>
                    {type.Ticket_Type_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ticket-amount">
              <div className="ticket-amount-row">
                <label>จำนวนบัตร/โซน*</label>
                <input
                  type="number"
                  min="0"
                  placeholder="จำนวนบัตร/โซน*"
                  style={{ backgroundColor: "white", color: "black" }}
                  value={zones[zone.Plan_id]?.seatCount || 0}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_id,
                      "seatCount",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="ticket-amount-row">
                <label>จำนวนที่นั่ง/บัตร</label>
                <input
                  type="number"
                  min="0"
                  placeholder="จำนวนที่นั่ง/ตั๋ว"
                  style={{ backgroundColor: "white", color: "black" }}
                  value={zones[zone.Plan_id]?.seatPerTicket || 0}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_id,
                      "seatPerTicket",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="price-section">
          <h3>ราคา ({zones[zone.Plan_id]?.prices?.length || 0})</h3>
          <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
              rows={zones[zone.Plan_id]?.prices || []}
              columns={columns.map((col) => ({
                ...col,
                renderCell: (params: GridRenderCellParams) => {
                  if (col.field === "startDate" || col.field === "endDate") {
                    return (
                      <DateTimePickerComponent
                        controlledValue={
                          params.value ? dayjs(params.value) : null
                        }
                        onChange={(date) =>
                          handlePriceChange(
                            zone.Plan_id,
                            params.row.id,
                            col.field,
                            date ? date.toISOString() : ""
                          )
                        }
                        label={col.headerName}
                      />
                    );
                  }
                  if (col.field === "price") {
                    return (
                      <input
                        type="number"
                        min="0"
                        value={params.value}
                        onChange={(e) =>
                          handlePriceChange(
                            zone.Plan_id,
                            params.row.id,
                            col.field,
                            e.target.value
                          )
                        }
                        style={{
                          width: "90%",
                          color: "black",
                          backgroundColor: "white",
                        }}
                      />
                    );
                  }
                  if (col.field === "delete") {
                    return (
                      <img
                        src={deleteOnIcon}
                        alt="delete-on"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          removeZonePrice(zone.Plan_id, params.row.id)
                        }
                      />
                    );
                  }
                  return null;
                },
              }))}
              pageSize={zones[zone.Plan_id]?.prices?.length || 0}
              autoHeight
              disableSelectionOnClick
              hideFooterPagination
            />
          </div>

          <button
            type="button"
            className="add-price"
            onClick={() => addZonePrice(zone.Plan_id)}
          >
            + เพิ่มราคาบัตร
          </button>
        </div>
        <div className="table-input-method-section">
          <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
          <select
            value={zones[zone.Plan_id]?.tableInputMethod || ""}
            onChange={(e) =>
              handleInputChange(
                zone.Plan_id,
                "tableInputMethod",
                e.target.value
              )
            }
            className="table-input-method-select"
          >
            <option value="">เลือกรูปแบบการระบุ</option>
            <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
            <option value="2">
              2.รันจาก 1 ถึง {zones[zone.Plan_id]?.seatCount || 0}
            </option>
            <option value="3">
              3.นำหน้าด้วย โต๊ะ ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.Plan_id]?.seatCount || 0} - (โต๊ะ 1- โต๊ะ{" "}
              {zones[zone.Plan_id]?.seatCount || 0})
            </option>
            <option value="4">
              4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.Plan_id]?.seatCount || 0} ([?] 1- [?]{" "}
              {zones[zone.Plan_id]?.seatCount || 0})
            </option>
            <option value="5">5.ไม่ระบุเลขโต๊ะ</option>
          </select>
          {/* <GenerateBoxes
            method={zones[zone.Plan_id]?.tableInputMethod || "1"}
            seatNumber={zones[zone.Plan_id]?.seatCount || 0}
            zoneId={zone.Plan_id}
          /> */}
        </div>
      </div>
    </Collapse>
  );
};

export default Plan;
