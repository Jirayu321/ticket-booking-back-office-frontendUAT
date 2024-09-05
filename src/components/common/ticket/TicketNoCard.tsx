import { ChangeEvent, FC } from "react";
import styles from "./ticket-no-card.module.css";
import { SwalError } from "../../../lib/sweetalert";

type Props = {
  ticketNo: string;
  index: number;
  ticketNumbers: string[];
  disabled?: boolean;
  onChange: (newTicketNumber: string, index: number) => void;
};

const TicketNoCard: FC<Props> = ({
  ticketNo,
  index,
  ticketNumbers,
  disabled = false,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <input
        disabled={disabled}
        min={0}
        onBlur={() => {
          const doesValueDuplicate =
            ticketNumbers.filter((tn) => tn === ticketNo && Boolean(ticketNo))
              .length > 1;

          if (doesValueDuplicate) {
            SwalError("ตัวเลขตั๋วซ้ำกัน");
            onChange("", index);
            return;
          }
        }}
        onFocus={(e) => e.target.select()}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value as string, index);
        }}
        value={ticketNo}
      />
    </div>
  );
};

export default TicketNoCard;
