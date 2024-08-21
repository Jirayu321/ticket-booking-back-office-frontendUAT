import React from "react";
import Container from "../../components/common/container/Container";
import TicketTypeContent from "./zone-content"; // Import the content component

const ZonePage: React.FC = () => {
  return (
    <Container>
      <TicketTypeContent />
    </Container>
  );
};

export default ZonePage;
