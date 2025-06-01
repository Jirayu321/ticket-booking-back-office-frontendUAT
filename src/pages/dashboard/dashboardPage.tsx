import { useRef } from "react";
import styles from "./dashboard-page.module.css";

export default function Dashboard() {
  const dashboardRef = useRef(null);
  const salesRef = useRef(null);
  const topRef = useRef(null);
  const repeatRef = useRef(null);

  const handleScroll = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header
        className={styles.header}
        style={{
          transform: "scale(0.65)",
          transformOrigin: "top left",
        }}
      >
        <nav className={styles.nav}>
          <a
            className={styles.tabItem}
            onClick={() => handleScroll(dashboardRef)}
          >
            แดชบอร์ด
          </a>
          <a className={styles.tabItem} onClick={() => handleScroll(salesRef)}>
            ยอดขายทั้งหมด
          </a>
          <a className={styles.tabItem} onClick={() => handleScroll(topRef)}>
            Top 10 ยอดขาย
          </a>
          <a className={styles.tabItem} onClick={() => handleScroll(repeatRef)}>
            ลูกค้าซื้อซ้ำ
          </a>
        </nav>
      </header>

      <section
        ref={dashboardRef}
        className={styles.summarySection}
        style={{
          transform: "scale(0.87)",
          transformOrigin: "top left",
        }}
      >
        <div className={`${styles.card1} `}>
          <p>ยอดขายวันนี้</p>
          <h2>฿375,900</h2>
        </div>
        <div className={`${styles.card2} `}>
          <p>คำสั่งซื้อวันนี้</p>
          <h2>156</h2>
        </div>
        <div className={`${styles.card3} `}>
          <p>ยอดชำระแล้ว</p>
          <h2>฿375,000</h2>
        </div>
        <div className={`${styles.card4} `}>
          <p>ยอดค้างชำระ</p>
          <h2>฿900</h2>
        </div>
      </section>

      {/* <section className={styles.totalSalesBox}>
        <h3>ยอดขายทั้งหมด</h3>
        <p className={styles.totalAmount}>฿375,900</p>
      </section>

      <section ref={salesRef} className={styles.sectionBox}>
        <h2>ยอดขายทั้งหมด</h2>
        <p>(mock)</p>
      </section>

      <section ref={topRef} className={styles.sectionBox}>
        <h2>Top 10 ยอดขาย</h2>
        <p>(mock)</p>
      </section>

      <section ref={repeatRef} className={styles.sectionBox}>
        <h2>ลูกค้าซื้อซ้ำ</h2>
        <p>(mock)</p>
      </section> */}
    </div>
  );
}
