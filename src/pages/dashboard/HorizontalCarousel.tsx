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
  const [focusedIndex, setFocusedIndex] = useState(0);

  // 🔍 IntersectionObserver เพื่อหา card ตรงกลาง
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            index: Number(entry.target.getAttribute("data-index")),
            ratio: entry.intersectionRatio,
          }))
          .sort((a, b) => b.ratio - a.ratio); // เรียงจากเห็นเยอะสุด

        if (visible.length > 0) {
          setFocusedIndex(visible[0].index);
        }
      },
      {
        root: container,
        threshold: [0.5, 0.75, 1], // สังเกตเฉพาะกลางๆ
        rootMargin: "0px",
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [detailsList]);

  // ✅ Auto scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollInterval = setInterval(() => {
      const isAtEnd =
        container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 400, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div ref={containerRef} className="carousel-container">
      {detailsList.map((details, index) => (
        <div
          key={details.Id}
          ref={(el) => (cardRefs.current[index] = el)}
          data-index={index}
          className={`carousel-card ${focusedIndex === index ? "focused" : ""}`}
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
