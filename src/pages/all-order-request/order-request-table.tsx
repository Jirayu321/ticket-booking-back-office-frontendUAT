import React from "react";
import Container from "../../components/common/container/Container";
import TableMoveHistoryContent from "./order-request-table-content"; // Import the content component

const PayOptionPage: React.FC = () => {
  return (
    <Container>
      <TableMoveHistoryContent />
    </Container>
  );
};

export default PayOptionPage;
