import { CircularProgress, Collapse } from "@mui/material";
import { FC, useState } from "react";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import { useUpdateTicketNumbers } from "../_hook/useUpdateTicketNumbers";
import { getPrefix, getStartNumber } from "../helper";
import { TicketNoOption } from "../type";
import LogPrices from "./LogPrices";
import NumberAndPrefix from "./NumberAndPrefix";
import SaveButton from "./SaveButton";
import SelectInputMethod from "./SelectInputMethod";
import TicketNoList from "./TicketNoList";

type BodyProps = {
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  removeZonePrice: any;
  Plan_Id: number;
  Plan_GroupId: number;
  refreshViewEventStocks: any;
};

const Body: FC<BodyProps> = ({
  zones,
  expandedZones,
  Plan_Id,
  Plan_GroupId,
  refreshViewEventStocks,
}) => {
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

  const firstTicketNumber = tempTicketNumbers[0];

  const [ticketNoOption, setTicketNoOption] = useState<TicketNoOption>(
    firstTicketNumber?.Ticket_No_Option ?? ""
  );

  const [startNumber, setStartNumber] = useState<number | null>(
    getStartNumber(firstTicketNumber?.Ticket_No, ticketNoOption)
  );

  const [prefix, setPrefix] = useState<string>(getPrefix(ticketNoOption));

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  function handleTicketOptionChange(option: TicketNoOption) {
    setTicketNoOption(option);
  }

  function handleTicketNumberChange(newTicketNumber: string, index: number) {
    setTempTicketNumbers((prev) =>
      prev.map((tnp, i) =>
        i === index ? { ...tnp, Ticket_No: newTicketNumber } : tnp
      )
    );
  }

  useUpdateTicketNumbers({
    startNumber,
    prefix,
    ticketNoOption,
    ticketNumber: firstTicketNumber,
    setStartNumber,
    setPrefix,
    setTempTicketNumbers,
  });

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
          <NumberAndPrefix
            ticketQtyPerPlan={seatQtyPerticket}
            ticketNoOption={ticketNoOption}
            startNumber={startNumber ?? 0}
            setStartNumber={setStartNumber}
            prefix={prefix}
            setPrefix={setPrefix}
          />
          <TicketNoList
            tempTicketNumbers={tempTicketNumbers}
            currentOption={ticketNoOption}
            handleTicketNumberChange={handleTicketNumberChange}
          />
        </div>
        {expandedZones[Plan_Id] ? (
          <SaveButton
            planId={Plan_Id}
            planGroupId={Plan_GroupId}
            refreshViewEventStocks={refreshViewEventStocks}
            ticketNumbers={tempTicketNumbers}
            ticketNoOption={ticketNoOption}
          />
        ) : null}
      </div>
    </Collapse>
  );
};

export default Body;
