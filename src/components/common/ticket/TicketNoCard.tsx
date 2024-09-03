import { ChangeEvent, FC } from "react";
import styles from "./ticket-no-card.module.css";

type Props = {
  ticketNo: string;
  onChange: (e: any) => void;
};

const TicketNoCard: FC<Props> = ({ ticketNo, onChange }) => {
  return (
    <div className={styles.container}>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value as string)
        }
        value={ticketNo}
      />
    </div>
  );
};

export default TicketNoCard;
