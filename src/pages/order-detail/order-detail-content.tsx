import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getOrderD } from "../../services/order-d.service";
// import { getOrderH } from "../../services/order-h.service";
import { getOrderAll, updateOrder } from "../../services/order-all.service";
import Header from "../common/header";
import BuyerInfo from "./details/BuyerInfo";
import OrderItems from "./details/OrderItems";
import PaymentHistory from "./details/PaymentHistory";
import { useFetchPaymentHistories } from "../../hooks/fetch-data/useFetchPaymentHistories";
import { FaMoneyBill, FaPrint } from "react-icons/fa";
import {
  // getViewTicketList,
  getViewTicketListbyOrderid,
} from "../../services/view-tikcet-list.service";

import QRCode from "qrcode";

const OrderDetailContent: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const location = useLocation();
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const initialTabIndex = parseInt(queryParams.get("tabIndex") || "0", 10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const navigate = useNavigate();

  const { data: paymentHistories, isFetching: isPaymentHistoriesLoading } =
    useFetchPaymentHistories({ orderId: order_id });

  const isOrderPaid = paymentHistories?.some((ph: any) => {
    return ph.Total_Balance === 0;
  });

  const handleNavigateBack = () => {
    localStorage.setItem("orderDetail", orderDetail?.Order_no);
    navigate("/all-orders");
  };

  const handleNavigateToOrderSite2 = async (order_id: string | number) => {
    const orderIdStr = String(order_id); // Ensure order_id is a string
    window.open(
      `https://deedclub.appsystemyou.com/ConcertInfo/${orderIdStr}?token=${localStorage.getItem(
        "token"
      )}`,
      "_blank"
    );
  };

  const handleNavigateToOrderSite = async (order_id: string | number) => {
    const response = await getViewTicketListbyOrderid(order_id);
    // const print = await updateOrder(order_id);
    console.log("tickets response:", response, order_id);

    if (Array.isArray(response.ticketList)) {
      let contentHtml = `
        <html>
          <head>
            <title>Print QR Codes</title>
            <style>
              body { margin: 0; padding: 0; }
              .ticket-container {
                text-align: center;
              }
              img { width: 90%; height: 80%; margin:0px; }
              p {
                font-size: 40px;
                font-weight: bold; 
                color: #333;
                margin:0px;
              }
              .details {
                font-size: 40px;
                color: #666;
                 margin:0px;
              }
                 .divbody{
                position: relative;
                top: -45px;
                 }
            </style>
          </head>
          <body>
      `;

      for (let ticket of response.ticketList) {
        const dataUrl = await QRCode.toDataURL(ticket.ticket_id.toString());
        if (ticket.ticket_no === "บัตรเสริม") {
          contentHtml += `
          <div class="ticket-container">
            <img src="${dataUrl}"/>
          <div class="divbody">
          <p class="details">${ticket.Event_Name}</p>
          <p class="details">
          (เบอร์โต๊ะ: ${ticket.ticket_no})
          - ที่นั่ง ${ticket.ticket_line}/${ticket.ticket_line}
          </p>
            <p class="details">เวลา: ${new Date(
              ticket.Event_Date
            ).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} - ${new Date(
            new Date(ticket.Event_Time).getTime() - 7 * 60 * 60 * 1000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })} น.</p>
          </div>
           
          
          </div>
        `;
        } else {
          contentHtml += `
          <div class="ticket-container">
            <img src="${dataUrl}"/>
            <p class="details">${ticket.Event_Name}</p>
            <p class="details">${new Date(ticket.Event_Time).toLocaleDateString(
              "th-TH",
              { year: "numeric", month: "long", day: "numeric" }
            )} - ที่นั่ง ${ticket.ticket_line}/${
            response.ticketList.length
          } (เบอร์โต๊ะ: ${ticket.ticket_no})</p>
            <p class="details">เวลา: ${new Date(
              ticket.Event_Time
            ).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}</p>
          </div>
        `;
        }
      }

      contentHtml += `
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
          </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      printWindow?.document.write(contentHtml);
      printWindow?.document.close();
    }
  };

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabIndex(newValue);
  // };

  useEffect(() => {
    setTabIndex(initialTabIndex);
  }, [initialTabIndex]);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const OrderAll = await getOrderAll();
        const order = OrderAll.hisPayment
          .filter((o: any) => String(o.Order_id) === order_id) // Filter matching orders
          .sort(
            (a: any, b: any) =>
              new Date(b.Payment_Date7).getTime() -
              new Date(a.Payment_Date7).getTime()
          )[0];
        if (order) {
          setOrderDetail(order);
          const relatedOrderItems = OrderAll.hisPayment.filter(
            (item: any) => item.Order_id === order.Order_id
          );

          setOrderItems(relatedOrderItems);
        } else {
          toast.error("Order not found");
        }
      } catch (error) {
        toast.error("Failed to fetch order data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetail();

    // Check if location state has a tab index to set
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setTabIndex(Number(tab));
    }
  }, [order_id, location.search]);

  if (isLoading) return <CircularProgress />;
  if (!orderDetail) return <Typography>Order not found</Typography>;

  let statusLabel;
  let bgColor;

  console.log("order :", orderDetail);
  switch (orderDetail.Order_Status) {
    case 1:
      if (orderDetail.Total_Balance === 0) {
        statusLabel = "สำเร็จ";
        bgColor = "#28a745";
      } else {
        statusLabel = "ค้างจ่าย";
        bgColor = "#ffc107";
      }
      break;
    case 2:
      statusLabel = "มีแก้ไข";
      bgColor = "#17a2b8";
      break;
    case 13:
      statusLabel = "ขอคืนเงิน";
      bgColor = "#dc3545";
      break;
    case 3:
      statusLabel = "ไม่สำเร็จเพราะติด R";
      bgColor = "#343a40";
      break;
    case 4:
      statusLabel = "ไม่สำเร็จจาก Omise";
      bgColor = "#6c757d";
      break;
    default:
      statusLabel = "ไม่ระบุ";
      bgColor = "#f8f9fa";
      break;
  }

  // if (isPaymentHistoriesLoading) return <CircularProgress />;

  return (
    <div>
      <Header title="รายละเอียดคำสั่งซื้อ" />

      <div
        style={{
          backgroundColor: "#000",
          width: "100%",
          // maxWidth: "1690px", // Fixed maximum width for the black header
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // padding: "0 20px",
          // margin: "0 auto", // Center the header
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              backgroundColor: "black",
              paddingTop: "20px",
              marginRight: "20px",
            }}
            onClick={handleNavigateBack}
          >
            <img
              src="/back.svg"
              alt="Back Icon"
              style={{ width: "58px", height: "58px" }}
            />
          </button>
          <h2
            style={{
              color: "white",
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {orderDetail.Order_no}
            <div
              style={{
                marginLeft: "20px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: bgColor,
                color: "#fff",
              }}
            >
              {statusLabel}
            </div>
          </h2>
        </div>
        <Button
          onClick={() => {
            isOrderPaid
              ? handleNavigateToOrderSite(order_id)
              : handleNavigateToOrderSite2(order_id);
          }}
          variant="contained"
          style={{
            backgroundColor: "#CFB70B",
            color: "#000",
            fontWeight: "bold",
            fontSize: "16px",
            height: "50px",
            marginRight: "20px",
          }}
          startIcon={
            isOrderPaid ? (
              <FaPrint style={{ color: "black" }} />
            ) : (
              <FaMoneyBill style={{ color: "black" }} />
            )
          }
        >
          {isOrderPaid ? "Print QR" : "ชำระส่วนที่เหลือ"}
        </Button>
      </div>

      <Container sx={{ my: 4, mx: 2 }}>
        {/* <Box style={{ width: "100%" }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="ข้อมูลผู้ซื้อ" sx={{ width: "50%" }} />
            <Tab label="ประวัติการชำระ" sx={{ width: "50%" }} />
          </Tabs>
        </Box> */}
        <Paper
          sx={{
            padding: "20px",
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            marginTop: "20px",
            width: "max-content",
          }}
        >
          <>
            <BuyerInfo buyer={orderDetail} />
            <OrderItems order_id={order_id} />
            <PaymentHistory dtOrderId={order_id} />
          </>
        </Paper>
      </Container>
    </div>
  );
};

export default OrderDetailContent;
