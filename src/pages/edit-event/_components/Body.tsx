import { CircularProgress, Collapse } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FC } from "react";
import { v4 } from "uuid";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import TicketNoCard from "../../../components/common/ticket/TicketNoCard";
import { sortTicketNo } from "../../../lib/util";
import styles from "./plan.module.css";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";

type BodyProps = {
  zone: any;
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  handlePriceChange: any;
  removeZonePrice: any;
  addZonePrice: any;
  onUpdatePlanInfo: any;
};

const Body: FC<BodyProps> = ({
  zone,
  zones,
  expandedZones,
  handleInputChange,
  handlePriceChange,
  removeZonePrice,
  addZonePrice,
  onUpdatePlanInfo,
}) => {
  const {
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    ticketNumbers,
    logEventPrices,
  } = zone;

  const sortedTicketNoPerPlans = ticketNumbers?.sort(sortTicketNo);

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

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

  if (isLoadingTicketTypes) return <CircularProgress />;

  return (
    <Collapse in={expandedZones[zone.planId]} timeout="auto" unmountOnExit>
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
                value={ticketTypeId || ""}
                onChange={(e) =>
                  onUpdatePlanInfo((prev: any) => ({
                    ...prev,
                    ticketTypeId: e.target.value,
                  }))
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
                  placeholder="จำนวนบัตร/โซน*"
                  style={{ backgroundColor: "white", color: "black" }}
                  value={seatQtyPerticket || 0}
                  onChange={(e) =>
                    onUpdatePlanInfo((prev: any) => ({
                      ...prev,
                      seatQtyPerticket: Number(e.target.value),
                    }))
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
                  value={ticketQtyPerPlan || 0}
                  onChange={(e) =>
                    onUpdatePlanInfo((prev: any) => ({
                      ...prev,
                      ticketQtyPerPlan: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="price-section">
          <h3>ราคา ({zones[zone.planId]?.prices?.length || 0})</h3>
          <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
              getRowId={(_) => v4()}
              rows={logEventPrices}
              columns={columns}
              pageSize={zones[zone.planId]?.prices?.length || 0}
              autoHeight
              disableSelectionOnClick
              hideFooterPagination
            />
          </div>

          <button
            type="button"
            className="add-price"
            onClick={() => addZonePrice(zone.planId)}
          >
            + เพิ่มราคาบัตร
          </button>
        </div>
        <div className="table-input-method-section">
          <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
          <select
            value={zones[zone.planId]?.tableInputMethod || ""}
            onChange={(e) =>
              handleInputChange(zone.planId, "tableInputMethod", e.target.value)
            }
            className="table-input-method-select"
          >
            <option value="">เลือกรูปแบบการระบุ</option>
            <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
            <option value="2">
              2.รันจาก 1 ถึง {zones[zone.planId]?.seatCount || 0}
            </option>
            <option value="3">
              3.นำหน้าด้วย โต๊ะ ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.planId]?.seatCount || 0} - (โต๊ะ 1- โต๊ะ{" "}
              {zones[zone.planId]?.seatCount || 0})
            </option>
            <option value="4">
              4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[zone.planId]?.seatCount || 0} ([?] 1- [?]{" "}
              {zones[zone.planId]?.seatCount || 0})
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
                <h4
                  style={{ color: "#ccc", width: "100%", textAlign: "center" }}
                >
                  ไม่พบข้อมูลเลขโต็ะ
                </h4>
              </>
            )
          ) : null}
          {/* <GenerateBoxes
              method={zones[zone.planId]?.tableInputMethod || "1"}
              seatNumber={zones[zone.planId]?.seatCount || 0}
              zoneId={zone.planId}
            /> */}
        </div>
      </div>
    </Collapse>
  );
};

export default Body;
