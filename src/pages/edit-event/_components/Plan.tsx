import { FC } from "react";
import styles from "./plan.module.css";
import { CircularProgress, Collapse } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import TicketNoCard from "../../../components/common/ticket/TicketNoCard";
import { useFetchTicketNoPerPlanByEventId } from "../../../hooks/fetch-data/useFetchTicketNoPerPlanByEventId";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { useFetchViewLogEventPrice } from "../../../hooks/fetch-data/useFetchViewLogEventPrice";
import { sortTicketNo } from "../../../lib/util";

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
  const { data: viewLogEventPrices, isPending: isLoadingViewLogEventPrice } =
    useFetchViewLogEventPrice({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  if (isLoadingTicketTypes || isLoadingViewLogEventPrice)
    return <CircularProgress />;

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
        viewLogEventPrices={viewLogEventPrices}
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
  viewLogEventPrices: any[];
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
  viewLogEventPrices,
}) => {
  const { Ticket_Type_Id, Ticket_Qty_Per, Ticket_Qty, Plan_Id, PlanGroup_Id } =
    zone;
  const { eventId } = useParams();
  const { data: ticketNoPerPlans, isPending: isLoadingTicketNoPerPlans } =
    useFetchTicketNoPerPlanByEventId({
      eventId: Number(eventId),
      planId: Plan_Id,
      planGroupId: PlanGroup_Id,
    });

  const sortedTicketNoPerPlans = ticketNoPerPlans?.sort(sortTicketNo);

  const columns: GridColDef[] = [
    {
      field: "Start_Datetime",
      headerName: "วันเริ่ม",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <DatePicker label="" dateTimeValue={params.value} setter={() => {}} />
        ) : (
          "ไม่ได้ระบุ"
        ),
    },
    {
      field: "End_Datetime",
      headerName: "วันที่สิ้นสุด",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <DatePicker label="" dateTimeValue={params.value} setter={() => {}} />
        ) : (
          "ไม่ได้ระบุ"
        ),
    },
    {
      field: "Plan_Price",
      headerName: "ราคา",
      width: 200,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        <input
          disabled
          type="number"
          min="0"
          value={Number(params.value)}
          onChange={(e) =>
            handlePriceChange(params.row.id, "price", e.target.value)
          }
          style={{ width: "90%", color: "black", backgroundColor: "white" }}
        />;
      },
    },
    // {
    //   field: "delete",
    //   headerName: "",
    //   width: 120,
    //   sortable: false,
    //   resizable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <img
    //       src={deleteOnIcon}
    //       alt="delete-on"
    //       style={{ cursor: "pointer" }}
    //       onClick={() => removeZonePrice(params.row.id)}
    //     />
    //   ),
    // },
  ];

  if (isLoadingTicketNoPerPlans) return <CircularProgress />;

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
              getRowId={(_) => crypto.randomUUID()}
              rows={viewLogEventPrices}
              columns={columns}
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
          {sortedTicketNoPerPlans ? (
            sortedTicketNoPerPlans.length > 0 ? (
              <section className={styles.ticketNoSection}>
                {sortedTicketNoPerPlans.map((tnp: any) => (
                  <TicketNoCard key={tnp.Ticket_No} ticketNo={tnp.Ticket_No} />
                ))}
              </section>
            ) : (
              <>
                <h4 style={{ color: "#ccc", width: "100%", textAlign : "center" }}>
                  ไม่พบข้อมูลเลขโต็ะ
                </h4>
              </>
            )
          ) : null}
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
