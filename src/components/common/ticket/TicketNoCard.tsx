import { FC } from "react";
import styles from "./ticket-no-card.module.css";

type Props = {
  ticketNo: string;
};

const TicketNoCard: FC<Props> = ({ ticketNo }) => {
  return <p className={styles.container}>{ticketNo}</p>;
};

export default TicketNoCard;
