import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "../../components/common/container/Container";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import Header from "../common/header";
import EditZonePriceForm from "./_components/EditZonePriceForm";
import Steps from "./_components/Steps";
import SubHeader from "./_components/sub-header/SubHeader";
import useEditEventStore from "./_hook/useEditEventStore";
import { useSyncEventInfo } from "./_hook/useSyncEventInfo";
import Form from "./_components/Form";

const EditEventPage = () => {
  const { eventId } = useParams();
  const { activeTab, setRefreshEventInfo } = useEditEventStore();

  const {
    data: event,
    isPending: isLoadingEvent,
    refetch: refreshEventInfo,
  } = useFetchEventList({
    eventId: Number(eventId),
  });

  useEffect(() => {
    setRefreshEventInfo(refreshEventInfo);
  }, [refreshEventInfo]);

  useSyncEventInfo(event);

  if (isLoadingEvent) return <CircularProgress />;

  return (
    <Container>
      <Header title="งานทั้งหมด" />
      {event ? <SubHeader event={event} /> : null}
      <Steps />
      {activeTab === "รายละเอียด" && <Form />}
      {activeTab === "โซน & ราคา" && (
        <EditZonePriceForm eventId={Number(eventId)} />
      )}
    </Container>
  );
};

export default EditEventPage;
