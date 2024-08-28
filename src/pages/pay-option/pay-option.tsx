import React from "react";
import Container from "../../components/common/container/Container";
import PayOptionContent from "./pay-option-content"; // Import the content component

const PayOptionPage: React.FC = () => {
  return (
    <Container>
      <PayOptionContent /> Ticket type content
    </Container>
  );
};

export default PayOptionPage;
