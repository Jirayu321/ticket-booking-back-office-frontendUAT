import { CircularProgress, Collapse } from "@mui/material";
import { FC, useState } from "react";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
// import { useUpdateTicketNumbers } from "../_hook/useUpdateTicketNumbers";
import { getPrefix, getStartNumber } from "../helper";
import { TicketNoOption } from "../type";
import LogPrices from "./LogPrices";
import NumberAndPrefix from "./NumberAndPrefix";
import SaveButton from "./SaveButton";
import SelectInputMethod from "./SelectInputMethod";
import TicketNoList from "./TicketNoList";
// import { useUpdateTicketNumbersBySeatQtyPerPlan } from "../_hook/useUpdateTicketNumbersBySeatQtyPerPlan";
import ConfirmNumberInput from "../../../components/common/input/date-picker/ConfirmNumberInput";
import { SwalError } from "../../../lib/sweetalert";

const OPTION_5 = "5";
const MAXIMUM_TICKET_QUANTITY = 1000;

type BodyProps = {
  zones: any;
  expandedZones: any;
  handleInputChange: any;
  removeZonePrice: any;
  plan: any;
  refreshViewEventStocks: any;
};

const Body: FC<BodyProps> = ({
  zones,
  expandedZones,
  refreshViewEventStocks,
  plan,
}) => {
  const state = usePlanInfoStore((state: any) => state);
  const { Plan_Id, PlanGroup_Id, Plan_Pic } = plan;
  const {
    planId,
    ticketTypeId,
    ticketQtyPerPlan,
    seatQtyPerticket,
    ticketNumbers,
    onUpdatePlanInfo,
    staticTicketQty,
  } = state;
  // console.log("state", state);
  const [tempTicketNumbers, setTempTicketNumbers] =
    useState<any[]>(ticketNumbers);

  const isTicketNoOption5ByDefault =
    tempTicketNumbers.length === 0 && staticTicketQty > 0;

  const firstTicketNumber = tempTicketNumbers[0];

  const [ticketNoOption, setTicketNoOption] = useState<TicketNoOption>(
    isTicketNoOption5ByDefault
      ? OPTION_5
      : firstTicketNumber?.Ticket_No_Option ?? ""
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

  // function handleTicketNumberChange(newTicketNumber: string, index: number) {
  //   setTempTicketNumbers((prev) =>
  //     prev.map((tnp, i) =>
  //       i === index ? { ...tnp, Ticket_No: newTicketNumber } : tnp
  //     )
  //   );
  // }

  // useUpdateTicketNumbers({
  //   startNumber,
  //   prefix,
  //   ticketNoOption,
  //   selectedTicketType:
  //     ticketTypes?.find(
  //       (ticketType: any) => ticketType.Ticket_Type_Id === Number(ticketTypeId)
  //     )?.Ticket_Type_Name ?? "",
  //   setPrefix,
  //   setTempTicketNumbers,
  // });

  // useUpdateTicketNumbersBySeatQtyPerPlan({
  //   seatQtyPerPlan: seatQtyPerticket,
  //   setTicketNumbers: setTempTicketNumbers,
  // });

  if (isLoadingTicketTypes) return <CircularProgress />;

  return (
    <Collapse in={expandedZones[planId]} timeout="auto" unmountOnExit>
      <div className="zone-content">
        <div className="ticket-layout">
          <div className="empty-image">
            <a href={Plan_Pic} target="_blank" rel="noopener noreferrer">
              <img
                src={Plan_Pic}
                alt="Plan Pic"
                style={{ width: "500px", height: "250px" }}
              />
            </a>
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
                <ConfirmNumberInput
                  value={seatQtyPerticket || 0}
                  max={MAXIMUM_TICKET_QUANTITY}
                  setter={(value: number) => {
                    if (value > MAXIMUM_TICKET_QUANTITY) {
                      SwalError(
                        `จำนวนบัตรต่อโซนต้องไม่เกิน ${MAXIMUM_TICKET_QUANTITY}`
                      );

                      return;
                    }
                    onUpdatePlanInfo({
                      ...state,
                      seatQtyPerticket: value,
                    });
                  }}
                  placeholder="จำนวนบัตร/โซน*"
                />
              </div>
              <div className="ticket-amount-row">
                <label>จำนวนที่นั่ง/บัตร</label>
                <input
                  onFocus={(e) => e.target.select()}
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
            selectedTicketType={
              ticketTypes?.find(
                (ticketType: any) =>
                  ticketType.Ticket_Type_Id === Number(ticketTypeId)
              )?.Ticket_Type_Name ?? ""
            }
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
          {ticketNoOption !== "" ? (
            <TicketNoList
              tempTicketNumbers={tempTicketNumbers}
              currentOption={ticketNoOption}
              // handleTicketNumberChange={handleTicketNumberChange}
            />
          ) : null}
        </div>
        <div style={{ marginTop: 20 }}>
          {expandedZones[Plan_Id] ? (
            <SaveButton
              planId={Plan_Id}
              planGroupId={PlanGroup_Id}
              refreshViewEventStocks={refreshViewEventStocks}
              ticketNumbers={tempTicketNumbers}
              ticketNoOption={ticketNoOption}
            />
          ) : null}
        </div>
      </div>
    </Collapse>
  );
};

export default Body;
