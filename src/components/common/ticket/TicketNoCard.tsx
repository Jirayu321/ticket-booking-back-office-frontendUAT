import { ChangeEvent, FC } from "react";
import styles from "./ticket-no-card.module.css";

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const doesTheTicketNoExist = ticketNumbers.some(
            (tn) => tn === e.target.value
          );

          if (doesTheTicketNoExist) return;
          onChange(e.target.value as string, index);
        }}
        value={ticketNo}
      />
    </div>
  );
};

export default TicketNoCard;
