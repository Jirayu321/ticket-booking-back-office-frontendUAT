import { useRef, useState, useEffect } from "react";
import styles from "./dashboard-page.module.css";
import HorizontalCarousel from "./HorizontalCarousel";
import { authAxiosClient } from "../../config/axios.config";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const yourData = [
  {
    Id: 1,
    Name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    Event_Date: "2025-06-02",
    Event_Time: "19:00:00",
    At: "Deed Club Trang",
    Desc: "ราคาเริ่มต้น 500 บาท",
  },
  {
    Id: 2,
    Name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    Event_Date: "2025-06-02",
    Event_Time: "19:00:00",
    At: "Deed Club Trang",
    Desc: "ราคาเริ่มต้น 500 บาท",
  },
  {
    Id: 3,
    Name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    Event_Date: "2025-06-02",
    Event_Time: "19:00:00",
    At: "Deed Club Trang",
    Desc: "ราคาเริ่มต้น 500 บาท",
  },

  // เพิ่มได้เรื่อย ๆ
];

const pieData = [
  { name: "Promptpay", value: 50, amount: 375900 },
  { name: "Credit card", value: 30, amount: 375900 },
  { name: "E-Banking", value: 20, amount: 375900 },
];

const COLORS = ["#ff4081", "#4caf50", "#03a9f4"];

const eventList = [
  {
    id: 1,
    name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    total: 375900,
    date: "8/5/2025",
    time: "22.00",
    paid: 375900,
    orders: 96,
    unpaid: 0,
  },
  {
    id: 2,
    name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    total: 375900,
    date: "8/5/2025",
    time: "22.00",
    paid: 375900,
    orders: 96,
    unpaid: 0,
  },
  {
    id: 3,
    name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    total: 375900,
    date: "8/5/2025",
    time: "22.00",
    paid: 375900,
    orders: 96,
    unpaid: 0,
  },
  {
    id: 4,
    name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    total: 375900,
    date: "8/5/2025",
    time: "22.00",
    paid: 375900,
    orders: 96,
    unpaid: 0,
  },
  {
    id: 5,
    name: "ลำไย ไหทองคำ",
    img: "https://26tickettrang.s3.ap-southeast-2.amazonaws.com/images/plans/3dddc1f3-e4de-4e5d-86c8-0e524810f0d8.png",
    total: 375900,
    date: "8/5/2025",
    time: "22.00",
    paid: 375900,
    orders: 96,
    unpaid: 0,
  },
  // เพิ่มรายการอื่น ๆ ตามต้องการ
];

export default function Dashboard() {
  const dashboardRef = useRef(null);
  const salesRef = useRef(null);
  const topRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);
  const repeatRef = useRef(null);

  const handleScroll = (ref: any) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatCurrency = (amount) => {
    // ตรวจสอบว่า amount เป็นประเภท number
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0.00";
    }

    // แปลงจำนวนเงินให้เป็นทศนิยม 2 ตำแหน่ง
    const formattedAmount = amount.toFixed(2);

    // ตรวจสอบว่ามีรูปแบบที่จัดรูปแบบแล้วอยู่หรือไม่
    const regex = /^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/;
    // ตรวจสอบว่าค่าเป็นประเภท string และมีรูปแบบที่จัดรูปแบบแล้วหรือไม่
    if (regex.test(formattedAmount)) {
      return formattedAmount; // คืนค่าเดิมถ้ามีการ format เรียบร้อยแล้ว
    }

    // เพิ่ม , เพื่อจัดรูปแบบจำนวนเงิน
    return formattedAmount.replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(eventList.length / itemsPerPage);
  const paginatedList = eventList.slice((currentPage - 1) * itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          resDailySales,
          resOrderCount,
          resTotalPaid,
          resTotalUnpaid,
          resTotalSales,
          resEventSales,
          resTop10,
          repeatedCustomers
        ] = await Promise.all([
          authAxiosClient.get("/api/dailySales"),
          authAxiosClient.get("/api/dailyOrderCount"),
          authAxiosClient.get("/api/totalPaid"),
          authAxiosClient.get("/api/totalUnpaid"),
          authAxiosClient.get("/api/totalSales"),
          authAxiosClient.post("/api/eventSales", { Event_Id: 325 }),
          authAxiosClient.get("/api/top10Event"),
          authAxiosClient.get("/api/repeatedCustomers")
        ]);

        console.log(
          "data:",
          resDailySales?.data,
          resOrderCount?.data,
          resTotalPaid?.data,
          resTotalUnpaid?.data,
          resTotalSales?.data,
          resEventSales?.data,
          resTop10?.data,
          repeatedCustomers.data
        );

        //   setSalesData({
        //     dailySales: resDailySales.data.data?.DailySales || 0,
        //     dailyOrderCount: resOrderCount.data.data?.DailyOrderCount || 0,
        //     totalPaid: resTotalPaid.data.data?.TotalPaid || 0,
        //     totalUnpaid: resTotalUnpaid.data.data?.TotalUnpaid || 0,
        //     totalSales: resTotalSales.data.data?.TotalSales || 0,
        //     eventSales: resEventSales.data.data?.EventTotalSales || 0,
        //     top10Customers: resTop10.data.data || [],
        //   });
      } catch (error) {
        console.error("❌ Error loading sales data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <header
        className={styles.header}
        style={{
          transform: "scale(0.65)",
          transformOrigin: "top left",
          justifyItems: "start",
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

      <div
        className={styles.Carousel}
        style={{
          transform: "scale(0.3)",
          transformOrigin: "top left",
          height: "200px",
        }}
      >
        {/* Carousel */}
        <div
          className="overflow-x-auto whitespace-nowrap hide-scrollbar"
          style={{ width: "875px" }}
        >
          <HorizontalCarousel detailsList={yourData} />
        </div>
        {/* Pie Chart */}
        <div
          className="w-full max-w-md mx-auto"
          style={{
            width: "260px",
            transform: "scale(1.7)",
            transformOrigin: "center",
            marginTop: "145px",
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* <Tooltip
                formatter={(value, name, props) => [
                  `฿${pieData[props?.payload?.payload?.index || 0]?.amount}`,
                  name,
                ]}
              /> */}
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
          <div style={{ width: "250px", marginTop: "-50px" }}>
            <p
              className="text-center font-bold mt-4 text-xl"
              style={{ color: "black" }}
            >
              จำนวนงานทั้งหมด : 20
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                justifyContent: "space-around",
              }}
            >
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                Promptpay :20
              </p>
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                ฿ 375,900
              </p>
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                Credit card : 20
              </p>
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                ฿ 375,900
              </p>
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                E-Banking : 20
              </p>
              <p
                className="text-center font-bold mt-4 text-xl"
                style={{ color: "black", margin: "0px" }}
              >
                ฿ 375,900
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className={styles.dateFilterWrapper}>
        <div className={styles.dateFilterBox}>
          <span className={styles.dateLabel}>วันที่</span>
          <div className={styles.dateRange}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              dateFormat="dd MMM yy"
              // locale={th}
              className={styles.dateInput}
              onCalendarOpen={() => setIsDateOpen(true)}
              onCalendarClose={() => setIsDateOpen(false)}
            />
            <span className={styles.dateSeparator}>→</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              dateFormat="dd MMM yy"
              // locale={th}
              className={styles.dateInput}
              onCalendarOpen={() => setIsDateOpen(true)}
              onCalendarClose={() => setIsDateOpen(false)}

              // withPortal
            />
            <img
              src="/CalendarBlank.svg"
              className={styles.calendarIcon}
              alt="calendar"
            />
          </div>
        </div>

        <button className={styles.searchButton}>
          <img src="/Search.svg" alt="search" width={20} />
        </button>

        <button className={styles.allButton}>All</button>
      </div>

      <section
        ref={dashboardRef}
        className={styles.summarySection}
        style={{
          transform: "scale(0.87)",
          transformOrigin: "top left",
          marginTop: isDateOpen ? "110px" : "-30px",
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

      <section ref={salesRef} className={styles.totalSalesBox}>
        <h3 className={styles.totalSalesHeader}>ยอดขายทั้งหมด</h3>
        <div className={styles.divsalesCard}>
          <div className={styles.salesCard}>
            <img src="/bag.svg" alt="bag" className={styles.salesIcon} />
            <p className={styles.salesLabel}>ยอดขายทั้งหมด</p>
            <p className={styles.totalAmount}>฿375,900</p>
          </div>
        </div>
      </section>

      <section className={styles.sectionBox2}>
        <p style={{ margin: 0, color: "black", marginLeft: "15px" }}>
          {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, eventList.length)} จาก{" "}
          {eventList.length} รายการ
        </p>
        {eventList.map((event, index) => (
          <div key={event.id} className={styles.eventRow}>
            <div
              className={`${styles.eventHeader} ${
                styles[`eventHeaderGradient${index % 4}`]
              }`}
            >
              <div className={styles.eventIndex}>{index + 1}.</div>
              <div className={styles.eventName}>{event.name}</div>
              <div className={styles.eventStatus}>ออนไลน์</div>
              <div className={styles.eventTotal}>
                ยอดขายทั้งหมด : ฿ {formatCurrency(event.total)}
              </div>
            </div>

            <div className={styles.eventDetail}>
              <img src={event.img} className={styles.eventImage} />
              <div className={styles.eventInfo}>
                <p>
                  วันจัดงาน : {event.date} {event.time}
                </p>
                <p>ชำระแล้ว : ฿ {formatCurrency(event.paid)}</p>
              </div>
              <div className={styles.eventInfo}>
                <p>คำสั่งซื้อทั้งหมด : {event.orders}</p>
                <p>ค้างชำระ : ฿ {formatCurrency(event.unpaid)}</p>
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            {"<"}
          </button>
          <button className={styles.pageButton}>{currentPage}</button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            {">"}
          </button>
        </div>
      </section>

      {/* <section  className={styles.sectionBox}>
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
