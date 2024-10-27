import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { getEventById, updateEventById, updatePublicEventById } from "../../../../services/event-list.service";
import styles from "../../edit-event-form.module.css";
import BackButton from "./BackButton";
import PublishButton from "./PublishButton";
import Swal from "sweetalert2";
import { getEventStock } from "../../../../services/event-stock.service";
import { getLogEventPrice } from "../../../../services/log-event-price.service";
import { updateLogEventPrice } from "../../../../services/log-event-price.service";
type SubHeaderProp = {
  event: any;
};

const SubHeader: FC<SubHeaderProp> = ({
  eventId,
  title,
  title2,
  description,
  eventDateTime,
  status,
  images,
  setTitle,
  setTitle2,
  setDescription,
  setEventDateTime,
  setStatus,
  setImages,
  setPlanGroupId,
  allRows,
  setAllRows
}) => {

  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (eventId) {
      getModelById(eventId);
    }
  }, []);

  async function getModelById(eventId: number) {
    try {
      const eventModel = await getEventById(eventId);
      console.debug(eventModel);
      setTitle(eventModel.Event_Name);
      setTitle2(eventModel.Event_Addr);
      setDescription(eventModel.Event_Desc);
      const adjustedEventTime = dayjs(eventModel.Event_Time).subtract(7, "hour").toISOString();
      setEventDateTime(adjustedEventTime);
      setStatus(Number(eventModel.Event_Status));
      setIsPublic(eventModel.Event_Public === "Y");
      setImages(0, eventModel.Event_Pic_1 || null);
      setImages(1, eventModel.Event_Pic_2 || null);
      setImages(2, eventModel.Event_Pic_3 || null);
      setImages(3, eventModel.Event_Pic_4 || null);
      setIsPublic(eventModel.Event_Public === "Y" ? true : false);

      const eventStock = await getEventStock();
      const eventStockModel = eventStock.filter((stc) => stc.Event_Id === eventId);
      console.debug("eventStockModel => ", eventStockModel);
      setPlanGroupId(eventStockModel[0].PlanGroup_Id);

      const logEventPrice = await getLogEventPrice();
      const logEventPriceModel = logEventPrice.filter((log) => log.Event_Id === eventId);
      console.debug("logEventPriceModel => ", logEventPriceModel);

      // โค้ดการอัพเดต allRows
      const updatedRows = {};

      for (const logEventPrice of logEventPriceModel) {
        const { Plan_Id, Start_Datetime, End_Datetime, Plan_Price, Log_Id } = logEventPrice;

        if (!updatedRows[Plan_Id]) {
          updatedRows[Plan_Id] = [];
        }

        updatedRows[Plan_Id].push({
          id: Log_Id,
          startDate: Start_Datetime,
          endDate: End_Datetime,
          price: Plan_Price,
        });
      }

      setAllRows((prevRows) => ({
        ...prevRows,
        ...updatedRows,
      }));

    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateEvent() {
    try {

      if (isPublic) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถแก้ไขได้ เนื่องจากมีการเผยแพร่อยู่',
          customClass: {
            title: "swal2-title",
            content: "swal2-content",
          },
        });
      } else {
        // Table : Event_List
        const eventTime = dayjs(eventDateTime).add(7, "hour").toISOString();
        const eventDate = dayjs(eventTime).add(7, "hour").toISOString().split("T")[0];
        const resUpdateEventList = await updateEventById(Number(event.Event_Id), {
          Event_Name: title,
          Event_Addr: title2,
          Event_Desc: description,
          Event_Date: eventDate,
          Event_Time: eventTime,
          Event_Status: status,
          Event_Pic_1: images[0],
          Event_Pic_2: images[1],
          Event_Pic_3: images[2],
          Event_Pic_4: images[3],
        });
        if (resUpdateEventList.status === 'SUCCESS') {
          // do nothing
        } else {
          console.error('Error updating event:', resUpdateEventList.message);
        }

        // Table : Log_Event_Price
        for (const planId in allRows) {
          const rows = allRows[planId];

          for (const row of rows) {
            const resUpdateLogEventPrice = await updateLogEventPrice({
              logId: row.id,
              startDateTime: row.startDate,
              endDateTime: row.endDate,
              updateBy: 'admin',
              planPrice: row.price
            });

            console.debug("Update response for logId", row.id, ":", resUpdateLogEventPrice);
          }
        }
      }
      const resUpdatePublic = await updatePublicEventById(Number(window.location.pathname.split('/edit-event/')[1]), isPublic);
      if (resUpdatePublic.status === 'SUCCESS') {
        window.location.replace('/all-events');
        Swal.fire({
          icon: 'success',
          title: 'แก้ไขรายการสำเร็จ',
          customClass: {
            title: "swal2-title",
            content: "swal2-content",
          },
        });
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }

  const handleCancel = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมดโปรดบันทึกข้อมูลไว้ก่อน"
    );
    if (userConfirmed) {
      window.location.replace("/all-events");
    }
  };

  function handleCopyEventLink(eventId: number) {
    const eventLink = `https://deedclub.appsystemyou.com/CheckIn/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("คัดลอกลิงก์งานสำเร็จ");
  }

  return (
    <div className={styles.subHeader} style={{ marginTop: "-10px" }}>
      <BackButton />
      <div className="toggle-container">
        <PublishButton event={event} isPublic={isPublic} setIsPublic={setIsPublic} />
        <button
          className=""
          style={{
            color: "#ffffff",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#28a745", // สีเขียว
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => handleCopyEventLink(event.Event_Id)}
          onMouseOver={(e) => (e.currentTarget.style.background = "#218838")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#28a745")}
        >
          <p
            style={{
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontSize: 14,
              fontWeight: "bold",
              margin: 0,
            }}
          >
            คัดลอกลิงก์ตรวจสอบตั๋วงาน
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
            style={{ width: 16, height: 16, marginLeft: 8 }}
          >
            <path
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button className="btn-cancel" onClick={handleCancel}>
          ยกเลิก
        </button>
        <button className="btn-save" onClick={handleUpdateEvent}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default SubHeader;
