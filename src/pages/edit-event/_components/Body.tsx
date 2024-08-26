import { CircularProgress, Collapse } from "@mui/material";
import { FC } from "react";
import TicketNoCard from "../../../components/common/ticket/TicketNoCard";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { sortTicketNo } from "../../../lib/util";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import LogPrices from "./LogPrices";
import styles from "./plan.module.css";

type BodyProps = {
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  handlePriceChange: any;
  removeZonePrice: any;
};

const Body: FC<BodyProps> = ({
  zones,
  expandedZones,
  handleInputChange,
  handlePriceChange,
}) => {
  const state = usePlanInfoStore((state: any) => state);
  const {
    planId,
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    logEventPrices,
    ticketNumbers,
    onUpdatePlanInfo,
  } = state;

  const sortedTicketNoPerPlans = ticketNumbers?.sort(sortTicketNo);

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  if (isLoadingTicketTypes) return <CircularProgress />;

  return (
    <Collapse in={expandedZones[planId]} timeout="auto" unmountOnExit>
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
                  onUpdatePlanInfo({
                    ...state,
                    ticketTypeId: e.target.value,
                  })
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
                    onUpdatePlanInfo({
                      ...state,
                      seatQtyPerticket: Number(e.target.value),
                    })
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
                    onUpdatePlanInfo({
                      ...state,
                      ticketQtyPerPlan: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <LogPrices
          planId={planId}
          zones={zones}
          logEventPrices={logEventPrices}
          handlePriceChange={handlePriceChange}
        />
        <div className="table-input-method-section">
          <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
          <select
            value={zones[planId]?.tableInputMethod || ""}
            onChange={(e) =>
              handleInputChange(planId, "tableInputMethod", e.target.value)
            }
            className="table-input-method-select"
          >
            <option value="">เลือกรูปแบบการระบุ</option>
            <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
            <option value="2">
              2.รันจาก 1 ถึง {zones[planId]?.seatCount || 0}
            </option>
            <option value="3">
              3.นำหน้าด้วย โต๊ะ ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[planId]?.seatCount || 0} - (โต๊ะ 1- โต๊ะ{" "}
              {zones[planId]?.seatCount || 0})
            </option>
            <option value="4">
              4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง{" "}
              {zones[planId]?.seatCount || 0} ([?] 1- [?]{" "}
              {zones[planId]?.seatCount || 0})
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
              method={zones[planId]?.tableInputMethod || "1"}
              seatNumber={zones[planId]?.seatCount || 0}
              zoneId={planId}
            /> */}
        </div>
      </div>
    </Collapse>
  );
};

export default Body;
