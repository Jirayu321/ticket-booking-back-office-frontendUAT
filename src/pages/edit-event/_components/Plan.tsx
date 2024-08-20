import { FC } from "react";
import styles from "./plan.module.css";
// import GenerateBoxes from "./GenerateBoxes";
import { CircularProgress, Collapse } from "@mui/material";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import deleteOnIcon from "/delete-on.svg";
import dayjs from "dayjs";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import { useParams } from "react-router-dom";

type PlanProps = {
  plan: any;
  plans: any[];
  onExpand: any;
  expandedZones: Record<string, boolean>;
};

const Plan: FC<PlanProps> = ({ plan, onExpand, plans, expandedZones }) => {
  const { eventId } = useParams();
  const { Plan_Id, Plan_Name, Plan_Desc, PlanGroup_Id } = plan;
  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();
  const { data: viewLogEventPrice, isPending: isLoadingViewLogEventPrice } =
    useFetchViewLogEventPrice({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  if (isLoadingTicketTypes || isLoadingViewLogEventPrice)
    return <CircularProgress />;

  console.log(viewLogEventPrice);

  return (
    <div className={styles.container}>
      <Header
        onExpand={onExpand}
        Plan_Id={Plan_Id}
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
        ticketTypes={ticketTypes}
        columns={[]}
      />
    </div>
  );
};

type HeaderProps = {
  onExpand: any;
  Plan_Id: number;
  Plan_Name: string;
  Plan_Desc: string;
};

const Header: FC<HeaderProps> = ({
  onExpand,
  Plan_Id,
  Plan_Name,
  Plan_Desc,
}) => {
  return (
    <header
      onClick={() => onExpand(Plan_Id, Plan_Name)}
      className={styles.header}
    >
      <h4>
        {Plan_Id}. {Plan_Name}
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
  const { Ticket_Type_Id, Ticket_Qty_Per, Ticket_Qty } = zone;
  return (
    <Collapse in={expandedZones[zone.Plan_Id]} timeout="auto" unmountOnExit>
      <div className="zone-content">
        <div className="ticket-layout">
          <div className="empty-image">
            <span>Image Placeholder</span>
          </div>
          <div className="ticket-details">
            <div className="ticket-type">
              <label>TICKET TYPE*</label>
              <select
                disabled
                className="ticket-type-select"
                value={Ticket_Type_Id || ""}
                onChange={(e) =>
                  handleInputChange(zone.Plan_Id, "ticketType", e.target.value)
                }
              >
                <option value="">เลือกประเภทตั๋ว</option>
                {ticketTypes?.map((ticketType: any) => (
                  <option
                    key={ticketType.Ticket_Type_Id}
                    value={ticketType.Ticket_Type_Id}
                  >
                    {ticketType.Ticket_Type_Name}
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
                  disabled
                  placeholder="จำนวนบัตร/โซน*"
                  style={{ backgroundColor: "white", color: "black" }}
                  value={Ticket_Qty || 0}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_Id,
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
                  disabled
                  placeholder="จำนวนที่นั่ง/ตั๋ว"
                  style={{ backgroundColor: "white", color: "black" }}
                  value={Ticket_Qty_Per || 0}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_Id,
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
          <h3>ราคา ({zones[zone.Plan_Id]?.prices?.length || 0})</h3>
          <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
              rows={zones[zone.Plan_Id]?.prices || []}
              columns={columns.map((col: any) => ({
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
                            zone.Plan_Id,
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
                            zone.Plan_Id,
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
                          removeZonePrice(zone.Plan_Id, params.row.id)
                        }
                      />
                    );
                  }
                  return null;
                },
              }))}
              pageSize={zones[zone.Plan_Id]?.prices?.length || 0}
              autoHeight
              disableSelectionOnClick
              hideFooterPagination
            />
          </div>

          <button
            type="button"
            className="add-price"
            onClick={() => addZonePrice(zone.Plan_Id)}
          >
            + เพิ่มราคาบัตร
          </button>
        </div>
        <div className="table-input-method-section">
          <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
          <select
            value={zones[zone.Plan_Id]?.tableInputMethod || ""}
            onChange={(e) =>
              handleInputChange(
                zone.Plan_Id,
                "tableInputMethod",
                e.target.value
              )
            }
            className="table-input-method-select"
          >
            <option value="">เลือกรูปแบบการระบุ</option>
            <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
            <option value="2">
              2.รันจาก 1 ถึง {zones[zone.Plan_Id]?.seatCount || 0}
            </option>
            <option value="3">
              3.นำหน้าด้วย โต๊ะ ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.Plan_Id]?.seatCount || 0} - (โต๊ะ 1- โต๊ะ{" "}
              {zones[zone.Plan_Id]?.seatCount || 0})
            </option>
            <option value="4">
              4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.Plan_Id]?.seatCount || 0} ([?] 1- [?]{" "}
              {zones[zone.Plan_Id]?.seatCount || 0})
            </option>
            <option value="5">5.ไม่ระบุเลขโต๊ะ</option>
          </select>
          {/* <GenerateBoxes
            method={zones[zone.Plan_Id]?.tableInputMethod || "1"}
            seatNumber={zones[zone.Plan_Id]?.seatCount || 0}
            zoneId={zone.Plan_Id}
          /> */}
        </div>
      </div>
    </Collapse>
  );
};

export default Plan;
