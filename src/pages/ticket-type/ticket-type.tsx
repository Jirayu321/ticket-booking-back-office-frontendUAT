import React from "react";
import Container from "../../components/common/container/Container";
import TicketTypeContent from "./ticket-type-content"; // Import the content component

const TicketTypePage: React.FC = () => {
  return (
    <Container>
      <TicketTypeContent /> {/* Ticket type content */}
    </Container>
  );
};

export default TicketTypePage;
