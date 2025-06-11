import { useEffect, useRef, useState } from "react";
import Countdown from "./Countdown";
import "./horizontal-carousel.css";
interface Props {
  detailsList: any[];
  filteredEventsdaily: any;
}
export default function HorizontalCarousel({
  detailsList,
  filteredEventsdaily,
}: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number, Event_Name: string) => {
    // ถ้าคลิกการ์ดที่ถูกเลือกอยู่ ให้ยกเลิกการเลือก
    setFocusedIndex(focusedIndex === index ? null : index);
    filteredEventsdaily(Event_Name);
    // เลื่อนการ์ดให้อยู่กลางจอ (optional)
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (container && card) {
      const containerWidth = container.offsetWidth;
      const cardWidth = card.offsetWidth;
      const scrollPosition =
        card.offsetLeft - containerWidth / 2 + cardWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    if (detailsList.length > 0) {
      // ✅ ถ้ายังไม่ได้เลือกการ์ดไหนเลย ให้เลือก index 0
      if (focusedIndex === null) {
        setFocusedIndex(0);
        filteredEventsdaily(detailsList[0].Event_Name);

        const container = containerRef.current;
        const card = cardRefs.current[0];
        if (container && card) {
          const containerWidth = container.offsetWidth;
          const cardWidth = card.offsetWidth;
          const scrollPosition =
            card.offsetLeft - containerWidth / 2 + cardWidth / 2;

          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, [detailsList]);

  return (
    <div ref={containerRef} className="carousel-container">
      {detailsList.map((details, index) => (
        <div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          data-index={index}
          className={`carousel-card ${focusedIndex === index ? "focused" : ""}`}
          onClick={() => handleCardClick(index, details.Event_Name)}
        >
          <div
            className="card-bg-blur"
            style={{ backgroundImage: `url(${details?.Event_Pic_1})` }}
          />
          <div className="card-content">
            <Countdown
              initialTime={details?.Event_Time}
              id={details.Event_Id}
              details={details}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
