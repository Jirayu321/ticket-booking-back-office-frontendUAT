import { useRef, useState, useEffect } from "react";
import styles from "./dashboard-page.module.css";
import HorizontalCarousel from "./HorizontalCarousel";
import { authAxiosClient } from "../../config/axios.config";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#ff4081", // Promptpay (ชมพู)
  "#4caf50", // Credit Card (เขียว)
  "#03a9f4", // E-Banking (ฟ้า)
  "#ffc107", // เงินสด (เหลือง)
  "#9c27b0", // สำรอง 1
  "#ff5722", // สำรอง 2
];

export default function Dashboard() {
  const dashboardRef = useRef(null);
  const salesRef = useRef(null);
  const topRef = useRef(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredEventSummary, setFilteredEventSummary] = useState([]);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [salesData, setSalesData] = useState({
    dailySales: 0,
    dailyOrderCount: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalSales: 0,
    eventSales: 0,
    top10: [],
    repeatedCustomers: [],
    eventSummary: [],
  });
  const [salesDatadaily, setSalesDatadaily] = useState({});
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);

  const [filters, setFilters] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // reset page when searching
  };

  const isEventInFilter = (eventName: string) => {
    const data = filteredEventsdaily.find(
      (event) => event.Event_Name === eventName
    );

    setSalesDatadaily(data);
  };
  console.log("salesDatadaily", salesDatadaily);

  const handleSearch = () => {
    const filtered = salesData.eventSummary.filter((event) => {
      const eventDate = new Date(event.Event_Time);
      return eventDate >= startDate && eventDate <= endDate;
    });

    setFilteredEventSummary(filtered);

    // ตั้งค่า default chart ให้ event แรกที่พบ
    if (filtered.length > 0) {
      isEventInFilter(filtered[0].Event_Name);
    }
  };
  const filteredEventsdaily = filteredEventSummary.filter((event) =>
    event?.Event_Name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const pieDataRaw = salesDatadaily?.PaidBreakdownByType
    ? salesDatadaily.PaidBreakdownByType.split(",").map((item) => {
        const [name, amount] = item.trim().split(":");
        return {
          name: name.trim(),
          amount: parseFloat(amount.trim()),
        };
      })
    : [];

  const total = pieDataRaw.reduce((sum, item) => sum + item.amount, 0);

  const pieData = pieDataRaw.map((item) => ({
    name: item.name,
    value: total > 0 ? +((item.amount / total) * 100).toFixed(2) : 0,
    amount: item.amount,
  }));

  const filteredEvents = salesData.eventSummary.filter((event) =>
    event?.Event_Name?.toLowerCase().includes(filters.search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalSales = filteredEvents.reduce(
    (sum, event) => sum + parseFloat(event?.TotalNetPrice || 0),
    0
  );

  const formatMinus7Hours = (utcString) => {
    const utcDate = new Date(utcString);

    // ลบ 7 ชั่วโมงจากเวลา UTC
    const minus7Date = new Date(utcDate.getTime() - 7 * 60 * 60 * 1000);

    // แสดงผลในรูปแบบ yyyy-mm-dd hh:mm:ss
    const year = minus7Date.getFullYear();
    const month = String(minus7Date.getMonth() + 1).padStart(2, "0");
    const day = String(minus7Date.getDate()).padStart(2, "0");
    const hour = String(minus7Date.getHours()).padStart(2, "0");
    const minute = String(minus7Date.getMinutes()).padStart(2, "0");
    // const second = String(minus7Date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}  ${hour}:${minute} น.`;
  };

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

  const formatCurrency2 = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0";
  }

  // ปัดเศษทศนิยมออก (floor)
  const roundedAmount = Math.floor(amount);

  return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        stroke="black"
        strokeWidth={0.8}
        paintOrder="stroke"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleResetFilter = () => {
    const defaultStart = new Date(`${new Date().getFullYear()}-01-01`);
    const latestEventTime = salesData.eventSummary.reduce((latest, event) => {
      const eventDate = new Date(event.Event_Time);
      return eventDate > latest ? eventDate : latest;
    }, new Date(0));

    setStartDate(defaultStart);
    setEndDate(latestEventTime);
    setFilters({ search: "" });
    setShowOnlyPublished(false);
    setFilteredEventSummary(salesData.eventSummary); // ✅ เซตตรงนี้ด้วย
    setCurrentPage(1);

    if (salesData.eventSummary.length > 0) {
      isEventInFilter(salesData.eventSummary[0].Event_Name);
    }
  };

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
          repeatedCustomers,
          eventSummary,
        ] = await Promise.all([
          authAxiosClient.get("/api/dailySales"),
          authAxiosClient.get("/api/dailyOrderCount"),
          authAxiosClient.get("/api/totalPaid"),
          authAxiosClient.get("/api/totalUnpaid"),
          authAxiosClient.get("/api/totalSales"),
          authAxiosClient.post("/api/eventSales", { Event_Id: 325 }),
          authAxiosClient.get("/api/top10Event"),
          authAxiosClient.get("/api/repeatedCustomers"),
          authAxiosClient.get("/api/eventSummary"),
        ]);

        const events = eventSummary.data.data || [];

        // ✅ หาวันที่ Event ล่าสุด
        const latestEventTime = events.reduce((latest, event) => {
          const eventDate = new Date(event.Event_Time);
          return eventDate > latest ? eventDate : latest;
        }, new Date(0));

        // ✅ ตั้ง state หลัก
        setSalesData({
          dailySales: resDailySales.data.data?.DailySales || 0,
          dailyOrderCount: resOrderCount.data.data?.DailyOrderCount || 0,
          totalPaid: resTotalPaid.data.data?.TotalPaid || 0,
          totalUnpaid: resTotalUnpaid.data.data?.TotalUnpaid || 0,
          totalSales: resTotalSales.data.data?.TotalSales || 0,
          eventSales: resEventSales.data.data?.EventTotalSales || 0,
          top10: resTop10.data.data || [],
          repeatedCustomers: repeatedCustomers.data.data || [],
          eventSummary: events,
        });

        // ✅ ตั้งค่าเริ่มต้นหลังจาก SalesData set แล้ว
        setTimeout(() => {
          handleResetFilter(); // 🔥 เรียกหลังจากโหลดครบ
        }, 0);
      } catch (error) {
        console.error("❌ Error loading sales data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("salesDatadaily", salesDatadaily);
  }, [salesDatadaily]);
  useEffect(() => {
    if (
      salesData.eventSummary.length > 0 &&
      filteredEventSummary.length === 0
    ) {
      handleResetFilter(); // ✅ เรียกหลังจากโหลดข้อมูลแล้วจริง ๆ
    }
  }, [salesData.eventSummary]);

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
          className={styles.hiddenScroll}
          style={{ width: "875px", height: "570px" }}
        >
          <HorizontalCarousel
            detailsList={
              showOnlyPublished
                ? filteredEventSummary.filter(
                    (event) => event.Event_Status === 1
                  )
                : filteredEventSummary
            }
            filteredEventsdaily={isEventInFilter}
          />
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
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontWeight="bold"
                fill="black"
              >
                ฿ {formatCurrency(salesDatadaily?.TotalNetPrice || 0)}
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ width: "250px", marginTop: "-50px" }}>
            <p
              className="text-center font-bold mt-4 text-xl"
              style={{ color: "black", justifySelf: "self-start" }}
            >
              จำนวนงานทั้งหมด :{" "}
              {formatCurrency2(salesDatadaily?.TotalOrders)}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            >
              {pieData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <span style={{ flex: 1, color: "black", fontWeight: "bold" }}>
                    {item.name}
                  </span>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    ฿ {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
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
              style={{ border: "none" }}
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
              style={{ border: "none" }}

              // withPortal
            />
            <img
              src="/CalendarBlank.svg"
              className={styles.calendarIcon}
              alt="calendar"
            />
          </div>
        </div>

        <button className={styles.searchButton} onClick={handleSearch}>
          <img src="/Search.svg" alt="search" width={20} />
        </button>

        <button className={styles.allButton} onClick={handleResetFilter}>
          All
        </button>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "-35px",
            marginBottom: "40px",
            color: "black",
            fontSize: "small",
          }}
        >
          <input
            type="checkbox"
            id="publishedCheckbox"
            checked={showOnlyPublished}
            onChange={(e) => setShowOnlyPublished(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              accentColor: "#FDC446",
              marginRight: "8px",
            }}
          />
          <label htmlFor="publishedCheckbox" style={{ fontWeight: 200 }}>
            แสดงเฉพาะงานที่เผยแพร่อยู่
          </label>
        </div>
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
          <p>ยอดขาย</p>
          <h2>{`฿${formatCurrency(salesDatadaily?.TotalNetPrice)}`}</h2>
        </div>
        <div className={`${styles.card2} `}>
          <p>คำสั่งซื้อ</p>
          <h2>{`${formatCurrency(salesDatadaily?.TotalOrders)}`}</h2>
        </div>
        <div className={`${styles.card3} `}>
          <p>ยอดชำระแล้ว</p>
          <h2>{`฿${formatCurrency(salesDatadaily?.TotalPaid)}`}</h2>
        </div>
        <div className={`${styles.card4} `}>
          <p>ยอดค้างชำระ</p>
          <h2>{`฿${formatCurrency(salesDatadaily?.TotalUnpaid)}`}</h2>
        </div>
      </section>

      <section ref={salesRef} className={styles.totalSalesBox}>
        <h3 className={styles.totalSalesHeader}>ยอดขายทั้งหมด</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            justifyContent: "start",
          }}
        >
          <label
            style={{
              color: "black",
              fontWeight: 200,
              border: "1px solid black",
              padding: "10px",
              borderRadius: "5px",
              borderRight: "none",
              marginBottom: "10px",
            }}
          >
            งาน
          </label>
          <input
            name="search"
            value={filters.search}
            onChange={handleTextFieldChange}
            placeholder="ค้นหางาน"
            style={{
              border: "1px solid black",
              height: "38px",
              marginLeft: "-3px",
              borderEndEndRadius: "5px",
              borderStartEndRadius: "5px",
              marginBottom: "10px",
              padding: "5px",
              width: "84vw",
            }}
          />
        </div>

        <div className={styles.divsalesCard}>
          <div className={styles.salesCard}>
            <img src="/bag.svg" alt="bag" className={styles.salesIcon} />
            <p className={styles.salesLabel}>ยอดขายทั้งหมด</p>
            <p className={styles.totalAmount}>฿{formatCurrency(totalSales)}</p>
          </div>
        </div>

        <section className={styles.sectionBox2}>
          <p style={{ margin: 0, color: "black", marginLeft: "15px" }}>
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredEvents.length)} จาก{" "}
            {filteredEvents.length} รายการ
          </p>
          {paginatedEvents.map((event, index) => (
            <div key={index} className={styles.eventRow}>
              <div
                className={`${styles.eventHeader} ${
                  styles[`eventHeaderGradient${index % 4}`]
                }`}
              >
                <div className={styles.eventIndex}>
                  {(currentPage - 1) * itemsPerPage + index + 1}.
                </div>
                <div className={styles.eventName}>{event?.Event_Name}</div>
                <div
                  className={
                    event?.Event_Status === 1
                      ? styles.eventStatus
                      : styles.eventStatus2
                  }
                >
                  {event?.Event_Status === 1 ? "ออนไลน์" : "ออฟไลน์"}
                </div>
                <div className={styles.eventTotal}>
                  ยอดขายทั้งหมด : ฿ {formatCurrency(event?.TotalNetPrice)}
                </div>
              </div>

              <div className={styles.eventDetail}>
                <img src={event?.Event_Pic_1} className={styles.eventImage} />
                <div className={styles.eventInfo}>
                  <p>วันจัดงาน : {formatMinus7Hours(event?.Event_Time)}</p>
                  <p>ชำระแล้ว : ฿ {formatCurrency(event?.TotalPaid)}</p>
                </div>
                <div className={styles.eventInfo}>
                  <p>คำสั่งซื้อทั้งหมด : {event?.TotalOrders}</p>
                  <p>ค้างชำระ : ฿ {formatCurrency(event?.TotalUnpaid)}</p>
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
      </section>

      <section
        ref={topRef}
        className={styles.totalSalesBox}
        style={{ marginTop: "25px" }}
      >
        <h3 className={styles.totalSalesHeader}>Top 10 ยอดขาย</h3>
        <section>
          {salesData.top10.map((event, index) => (
            <div key={event?.Event_Id} className={styles.eventRowTop}>
              <div className={styles.eventDetailtop}>
                <img src={event?.Event_Pic_1} className={styles.eventImage} />
                <div className={styles.eventInfotop}>
                  <p className={styles.numbertop}>{index + 1}</p>
                  <div>
                    <p style={{ color: "#FCBE2D", margin: 0 }}>
                      {event?.Event_Name}
                    </p>
                    <div className={styles.Detailtop}>
                      <p>
                        ยอดขายทั้งหมด : ฿ {formatCurrency(event?.TotalPaid)}
                      </p>
                      <p>บัตรทั้งหมด : {formatCurrency(event?.Ticket_Count)}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.eventInfo}></div>
              </div>
            </div>
          ))}
        </section>
      </section>

      <section
        ref={repeatRef}
        className={styles.totalSalesBox}
        style={{ marginTop: "25px" }}
      >
        <h3 className={styles.totalSalesHeader}>ลูกค้าซื้อซ้ำ</h3>
        <section>
          {salesData.repeatedCustomers.map((event, index) => (
            <div
              key={index}
              className={styles.eventRow}
              style={{ margin: "10px 0px", borderRadius: "10px" }}
            >
              <div className={styles.coutomDetail}>
                <p style={{ color: "#FCBE2D" }}>{event?.Cust_name}</p>
                <p>{event?.Cust_tel}</p>
                <p>จำนวนซื้อซ้ำ : {formatCurrency(event?.OrderCount)}</p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
