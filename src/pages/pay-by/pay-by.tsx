import React from "react";
import Container from "../../components/common/container/Container";
import PayByContent from "./pay-by-content"; // Import the content component

const PayByPage: React.FC = () => {
  return (
    <Container>
      <PayByContent /> {/* Ticket type content */}
    </Container>
  );
};

export default PayByPage;
