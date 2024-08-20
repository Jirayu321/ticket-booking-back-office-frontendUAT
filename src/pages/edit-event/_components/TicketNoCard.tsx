import { FC } from "react";

type Props = {
  ticketNo: string;
};

const TicketNoCard: FC<Props> = ({ ticketNo }) => {
  return <p style={{ color: "black" }}>{ticketNo}</p>;
};

export default TicketNoCard;
