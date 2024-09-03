import { CircularProgress, Collapse } from "@mui/material";
import { FC, useState } from "react";
import TicketNoCard from "../../../components/common/ticket/TicketNoCard";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import LogPrices from "./LogPrices";
import styles from "./plan.module.css";
import SelectInputMethod from "./SelectInputMethod";
import { TicketNoOption } from "../type";

type BodyProps = {
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  removeZonePrice: any;
};

const Body: FC<BodyProps> = ({ zones, expandedZones, handleInputChange }) => {
  const state = usePlanInfoStore((state: any) => state);
  const {
    planId,
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    ticketNumbers,
    onUpdatePlanInfo,
  } = state;

  const [tempTicketNumbers, setTempTicketNumbers] =
    useState<any[]>(ticketNumbers);

  const [ticketNoOption, setTicketNoOption] = useState<TicketNoOption>(
    tempTicketNumbers[0]?.Ticket_No_Option ?? ""
  );

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  function handleTicketOptionChange(option: TicketNoOption) {
    setTicketNoOption(option);
  }

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
        <LogPrices planId={planId} zones={zones} />
        <div className="table-input-method-section">
          <SelectInputMethod
            currentPlan={
              zones.filter((zone: any) => zone.Plan_Id === planId)[0]
            }
            currentOption={ticketNoOption}
            setTicketOption={handleTicketOptionChange}
          />
          {Boolean(tempTicketNumbers) ? (
            <section className={styles.ticketNoSection}>
              {tempTicketNumbers.map((tnp: any) => (
                <TicketNoCard
                  key={tnp.Ticket_No}
                  ticketNo={tnp.Ticket_No}
                  onChange={() => {}}
                />
              ))}
            </section>
          ) : (
            <>
              <h4 style={{ color: "#ccc", width: "100%", textAlign: "center" }}>
                ไม่พบข้อมูลเลขโต็ะ
              </h4>
            </>
          )}
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
