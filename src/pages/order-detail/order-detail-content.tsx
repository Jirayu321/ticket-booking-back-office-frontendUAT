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
import { useNavigate, useParams } from "react-router-dom";
import { getOrderD } from "../../services/order-d.service";
import { getOrderH } from "../../services/order-h.service";
import Header from "../common/header";
import BuyerInfo from "./details/BuyerInfo";
import OrderItems from "./details/OrderItems";
import PaymentHistory from "./details/PaymentHistory";
import { useFetchPaymentHistories } from "../../hooks/fetch-data/useFetchPaymentHistories";
import { FaMoneyBill, FaPrint } from "react-icons/fa";

const ENDPOINT = "https://deedclub.appsystemyou.com";

const OrderDetailContent: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const { data: paymentHistories, isFetching: isPaymentHistoriesLoading } =
    useFetchPaymentHistories({ orderId: order_id });

  const isOrderPaid = paymentHistories?.some((ph: any) => {
    return ph.Total_Balance === 0;
  });

  const handleNavigateBack = () => {
    navigate("/all-orders");
  };

  const handleNavigateToOrderSite = () => {
    window.location.assign(
      `${ENDPOINT}/ConcertInfo/${order_id}?token=${localStorage.getItem(
        "token"
      )}`
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const orderH = await getOrderH();
        const orderD = await getOrderD();
        const order = orderH.find((o: any) => String(o.Order_id) === order_id);

        if (order) {
          setOrderDetail(order);
          const relatedOrderItems = orderD.filter(
            (item: any) => item.Order_id === order.Order_id
          );

          // Log the filtered orderD items
          console.log("Filtered orderD items:", relatedOrderItems);

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
  }, [order_id]);

  if (isLoading) return <CircularProgress />;
  if (!orderDetail) return <Typography>Order not found</Typography>;

  // Determine the status based on the Order_Status and Total_Balance
  let statusLabel;
  let bgColor;

  switch (orderDetail.Order_Status) {
    case 1:
      if (orderDetail.Total_Balance === 0) {
        statusLabel = "สำเร็จ";
        bgColor = "#28a745"; // Green for success
      } else {
        statusLabel = "ค้างจ่าย";
        bgColor = "#ffc107"; // Yellow for pending payment
      }
      break;
    case 2:
      statusLabel = "มีแก้ไข";
      bgColor = "#17a2b8"; // Blue for modifications
      break;
    case 13:
      statusLabel = "ขอคืนเงิน";
      bgColor = "#dc3545"; // Red for refund
      break;
    case 3:
      statusLabel = "ไม่สำเร็จเพราะติด R";
      bgColor = "#343a40"; // Dark gray for failure due to R
      break;
    case 4:
      statusLabel = "ไม่สำเร็จจาก Omise";
      bgColor = "#6c757d"; // Gray for Omise failure
      break;
    default:
      statusLabel = "ไม่ระบุ";
      bgColor = "#f8f9fa"; // Light gray for unknown status
      break;
  }

  if (isPaymentHistoriesLoading) return <CircularProgress />;

  return (
    <div className="create-new-event">
      <Header title="รายละเอียดคำสั่งซื้อ" />

      <div
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
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
          onClick={handleNavigateToOrderSite}
          variant="contained"
          style={{
            backgroundColor: "#CFB70B",
            color: "#000",
            fontWeight: "bold",
            fontSize: "16px",
            height: "50px",
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
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Box style={{ width: "100%" }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="ข้อมูลผู้ซื้อ" sx={{ width: "33.33%" }} />
            <Tab label="คำสั่งซื้อ" sx={{ width: "33.33%" }} />
            <Tab label="ประวัติการชำระ" sx={{ width: "33.33%" }} />
          </Tabs>
        </Box>
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {tabIndex === 0 && <BuyerInfo buyer={orderDetail} />}
          {tabIndex === 1 && <OrderItems items={orderItems} />}
          {tabIndex === 2 && <PaymentHistory payments={[]} />}
        </Paper>
      </Container>
    </div>
  );
};

export default OrderDetailContent;
