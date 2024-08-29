import { FC } from "react";
import Container from "../../components/common/container/Container";
import AllEventContent from "./all-event-content";
import ProtectedRoute from "../../components/common/ProtectedRoute";

const AllEvent: FC = () => {
  return (
    <ProtectedRoute>
      <Container>
        <AllEventContent />
      </Container>
    </ProtectedRoute>
  );
};

export default AllEvent;
