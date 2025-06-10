import { useEffect, useRef, useState } from "react";
import Countdown from "./Countdown";
import {
  getStartDate,
  formatDate,
  formatTime,
} from "../../lib/utils/date.util";
import "./horizontal-carousel.css";

type CardDetails = {
  Id: number;
  Name: string;
  img: string;
  Event_Date: string;
  Event_Time: string;
  At: string;
  Desc?: string;
};

type Props = {
  detailsList: CardDetails[];
};

export default function HorizontalCarousel({ detailsList }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    // ถ้าคลิกการ์ดที่ถูกเลือกอยู่ ให้ยกเลิกการเลือก
    setFocusedIndex(focusedIndex === index ? null : index);

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

  // ... ส่วนอื่นๆ ของโค้ดที่เหลือ ...

  return (
    <div ref={containerRef} className="carousel-container">
      {detailsList.map((details, index) => (
        <div
          key={details.Id}
          ref={(el) => (cardRefs.current[index] = el)}
          data-index={index}
          className={`carousel-card ${focusedIndex === index ? "focused" : ""}`}
          onClick={() => handleCardClick(index)}
        >
          <div
            className="card-bg-blur"
            style={{ backgroundImage: `url(${details.img})` }}
          />
          <div className="card-content">
            <Countdown
              initialTime={getStartDate(details.Event_Date, details.Event_Time)}
              id={details.Id}
              details={details}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
