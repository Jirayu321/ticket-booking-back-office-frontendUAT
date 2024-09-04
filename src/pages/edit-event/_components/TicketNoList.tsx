import { FC } from "react";
import TicketNoCard from "../../../components/common/ticket/TicketNoCard";
import styles from "./plan.module.css";
import { TicketNoOption } from "../type";

type Props = {
  tempTicketNumbers: any;
  handleTicketNumberChange: any;
  currentOption: TicketNoOption;
};

const TicketNoList: FC<Props> = ({
  tempTicketNumbers,
  handleTicketNumberChange,
  currentOption,
}) => {
  return Boolean(tempTicketNumbers) ? (
    <section className={styles.ticketNoSection}>
      {tempTicketNumbers.map((tnp: any, index: number) => (
        <TicketNoCard
          key={index}
          index={index}
          disabled={
            currentOption === "2" ||
            currentOption === "3" ||
            currentOption === "4" ||
            currentOption === "5"
          }
          ticketNumbers={tempTicketNumbers.map((tn: any) => tn.Ticket_No)}
          ticketNo={tnp.Ticket_No}
          onChange={handleTicketNumberChange}
        />
      ))}
    </section>
  ) : (
    <>
      <h4 style={{ color: "#ccc", width: "100%", textAlign: "center" }}>
        ไม่พบข้อมูลเลขโต็ะ
      </h4>
    </>
  );
};

export default TicketNoList;
