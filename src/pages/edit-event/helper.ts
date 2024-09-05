import { getOnlyNumber, isInTimeRange } from "../../lib/util";
import { TicketNoOption } from "./type";

export function getStartNumber(
  ticketNumber: string,
  option: TicketNoOption
): number | null {
  if (option === "2") return Number(ticketNumber);
  if (option === "4") return getOnlyNumber(ticketNumber);
  return null;
}

export function getPrefix(option: TicketNoOption): string {
  if (option === "3") return "โต๊ะ";
  return "";
}

export function validateLogEventPrices(logEventPrices: any[]): {
  message: string;
  isValid: boolean;
} {
  let message: string = "",
    isValid: boolean = true;

  const doesHaveOverlappedTime = logEventPrices
    .map((lep: any) => {
      const isOverlapped = logEventPrices.some((lep2: any) => {
        if (lep.id === lep2.id) return false;
        return (
          isInTimeRange({
            targetDate: new Date(lep.Start_Datetime),
            from: new Date(lep2.Start_Datetime),
            to: new Date(lep2.End_Datetime),
          }) ||
          isInTimeRange({
            targetDate: lep.End_Datetime,
            from: new Date(lep2.Start_Datetime),
            to: new Date(lep2.End_Datetime),
          })
        );
      });
      return isOverlapped;
    })
    .includes(true);

  if (doesHaveOverlappedTime) {
    message = "ระยะเวลาที่เลือกมีการซ้อนทับกับราคาอื่นๆ";
    isValid = false;
  }

  const doesHaveZeroPrice = logEventPrices.some(
    (lep: any) => lep.Plan_Price <= 0
  );

  if (doesHaveZeroPrice) {
    message = "ราคาของบัตรต้องมีค่ามากกว่า 0";
    isValid = false;
  }

  const doesHaveSameStartAndEndTime = logEventPrices.some(
    (lep: any) => new Date(lep.Start_Datetime) === new Date(lep.End_Datetime)
  );

  if (doesHaveSameStartAndEndTime) {
    message = "ระยะเวลาเริ่มต้นและสิ้นสุดต้องไม่เท่ากัน";
    isValid = false;
  }

  return { message, isValid };
}

export function validateTicketNumbers(
  ticketNumbers: string[],
  inputOption: TicketNoOption
): {
  message: string;
  isValid: boolean;
} {
  const hasEmptyTicketNumber = ticketNumbers.some(
    (tn: any) => tn.Ticket_No === ""
  );

  if (inputOption === "") {
    return {
      message: "กรุณาเลือกวิธีการใส่หมายเลขตั๋ว",
      isValid: false,
    };
  }

  if (hasEmptyTicketNumber && inputOption !== "5") {
    return {
      message: "กรุณากรอกหมายเลขตั๋ว",
      isValid: false,
    };
  }

  return {
    message: "",
    isValid: true,
  };
}
