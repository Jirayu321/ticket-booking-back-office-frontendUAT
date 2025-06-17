import React, { useState, useEffect, useRef } from "react";
import { authAxiosClient } from "../../config/axios.config";
import WalkinModal from "./WalkinModal";
import MoveTableDialog from "./MoveTableDialogComponent";
import { getTableMoveHistory } from "../../services/table-move.service.ts";

import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Container,
  Grid,
  Avatar,
  Box,
  Typography,
  Modal,
  IconButton,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
} from "@mui/material";
import Header from "../common/header";
import OrderDetailContent from "../order-detail/order-detail-content";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import "moment/locale/th";
import Swal from "sweetalert2";
import { SwalSuccess } from "../../lib/sweetalert";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useFetchOrdertList } from "../../hooks/fetch-data/useFetchEventList";
import { getViewEventStock, getAvailableTablesByPlan } from "../../lib/api";

import { getViewTicketListbyOrderid } from "../../services/view-tikcet-list.service";

// import { updateOrder } from "../../services/order-all.service";
import QRCode from "qrcode";
import { FaMoneyBill, FaPrint } from "react-icons/fa";

import io from "socket.io-client";

import {
  selectedColor,
  paymentStatusBgColor0,
  paymentStatusBgColor1,
  paymentStatusBgUnknown,
} from "../../lib/util";

moment.locale("th");
const AllOrderContent: React.FC = () => {
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  console.log("orderDetail", orderDetail);
  const [orderHispayDetail, setOrderHispayDetail] = useState<any[]>([]);
  console.log("orderHispayDetail", orderHispayDetail);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [count, setCount] = useState<boolean>(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const [events, setEvents] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { refetch } = useFetchOrdertList({ count });

  const [walkinModalOpen, setWalkinModalOpen] = useState(false);

  const [newMove, setNewMove] = useState({
    Order_ID: "",
    Cust_Name: "",
    From_Table: "",
    To_Table: "",
    From_Zone: "",
    To_Zone: "",
    Move_Remark: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isSingleOrder, setIsSingleOrder] = useState(false);
  const [isSingleTable, setIsSingleTable] = useState(false);

  const handleOpenDialog = (order: any[]) => {
    setOpenDialog(true);
    console.log("order:", order);

    const datemp = JSON.parse(localStorage.getItem("emmp") || "{}");
    const empName = datemp?.Emp_Name || "ไม่ทราบชื่อ";

    const isSingleOrder = order.length === 1;
    const rawTicketNo = order.at(0)?.TicketNo_List || "";
    const isSingleTable = rawTicketNo && !rawTicketNo.includes(",");
    const formattedTicket = rawTicketNo.trim().startsWith("A")
      ? "Walk-in"
      : rawTicketNo.trim();
    setIsSingleOrder(order.length === 1);
    setIsSingleTable(rawTicketNo && !rawTicketNo.includes(","));
    setNewMove((prev) => ({
      Order_ID: order.at(0)?.Order_no || "",
      Cust_Name: order.at(0)?.Cust_name || "",
      From_Table: isSingleOrder && isSingleTable ? formattedTicket : "",
      To_Table: "",
      Moved_By: empName,
      Move_Remark: "",
      From_Zone: isSingleOrder ? order.at(0)?.Plan_Name || "" : "",
      To_Zone: "",
    }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMove((prev) => ({
      Order_ID: "",
      Cust_Name: "",
      From_Table: "",
      To_Table: "",
      Moved_By: prev.Moved_By,
      Move_Remark: "",
      From_Zone: "",
      To_Zone: "",
    }));
  };

  const handleChangeNewMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMove({ ...newMove, [e.target.name]: e.target.value });
  };

  const handleSubmitMove = async () => {
    const { Order_ID, Cust_Name, From_Table, To_Table, Moved_By, Move_Remark } =
      newMove;

    if (!Order_ID || !Cust_Name || !From_Table || !To_Table) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await authAxiosClient.post("/api/table-move/full", {
        Order_ID,
        Cust_Name,
        From_Table,
        To_Table,
        Moved_By,
        Move_Remark,
      });

      const { status, message, needPayment, diffAmount, qrUrl } = response.data;

      if (status === "success") {
        if (needPayment && diffAmount > 0 && qrUrl) {
          const confirmPay = window.confirm(
            `คุณต้องชำระเพิ่ม ${diffAmount.toLocaleString()} บาท\nกด OK เพื่อดู QR Code ชำระเงิน`
          );
          if (confirmPay) {
            window.open(qrUrl, "_blank");
          }
        }

        // alert("ย้ายโต๊ะสำเร็จ");
        handleCloseDialog();
        window.location.replace("/all-orders");

        // fetchTableMoveHistory();
      } else {
        alert(message || "ไม่สามารถย้ายโต๊ะได้");
      }
    } catch (err) {
      console.error("❌ Failed to move table", err);
      alert("เกิดข้อผิดพลาดในการย้ายโต๊ะ");
    }
  };
  const datamovetable = async (order: any[]) => {
    const result = await getTableMoveHistory();
  };

  const [displayOrderStatus, setDisplayOrderStatus] = useState("");
  const handleOrderStatus = async (OrderStatus, orderDetail) => {
    try {
      const result = await getTableMoveHistory();
      const orderId = orderDetail?.Order_id;
      const moved = result?.some((move) => move.Order_ID === orderId);
      return moved ? `${OrderStatus} | ย้ายโต๊ะ` : OrderStatus;
    } catch (error) {
      console.error("Error checking move status:", error);
      return OrderStatus;
    }
  };

  const socketRef = useRef<any>(null);

  if (!socketRef.current) {
    socketRef.current = io(
      "https://deedclub-staff-backend-uat2.appsystemyou.com",
      {
        path: "/socket_io",
      }
    );
  }

  const initialize = async () => {
    setIsFetching(true);
    const result = await refetch();
    if (result?.data) {
      setEvents(result.data);
      console.log("ข้อมูล data เปลี่ยนไป:", result.data);
    }
    setIsFetching(false);
  };

  const evntDetail = events?.dataEvent?.events.filter(
    (event: any) => event?.Event_Public === "Y"
  );

  const orderHData =
    events?.dataOrder?.orderAll?.filter(
      (order: any) => order?.DT_order_id !== null
    ) || [];

  const orderDData =
    events?.dataOrder?.hisPayment?.filter(
      (order: any) => order?.Net_Price !== null
    ) || [];

  const OrderAll = events?.dataOrder;

  const onLoadOrderDetail = async () => {
    await handleClearFilters();
    await handleOrderClick(localStorage.getItem("orderDetail"));
  };

  const handleOrderprevData = (
    orderNo: any,
    data: any = [],
    orderDData: any = []
  ) => {
    if (!data.length || !orderDData.length) {
      return;
    }

    localStorage.setItem("orderDetail", orderNo);
    setSelectedOrderNo(orderNo);
    const latestOrder = data
      .filter((order) => order.Order_no === orderNo)
      .reduce((acc, current) => {
        const existingOrder = acc.find(
          (order) => order.Order_id === current.Order_id
        );

        if (existingOrder) {
          const existingPaymentDate = new Date(existingOrder.Payment_Date7);
          const currentPaymentDate = new Date(current.Payment_Date7);

          if (currentPaymentDate > existingPaymentDate) {
            return acc.map((order) =>
              order.Order_id === current.Order_id ? current : order
            );
          } else {
            return acc;
          }
        } else {
          acc.push(current);
        }

        return acc;
      }, []);

    setOrderDetail(latestOrder);

    const h = orderDData
      .filter((order) => order.Order_no === orderNo)
      .sort(
        (a, b) =>
          new Date(a.Payment_Date7).getTime() -
          new Date(b.Payment_Date7).getTime()
      );

    setOrderHispayDetail(h);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;

    // อัปเดต state filters
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [name as string]: value,
      };

      // เก็บค่า filters ใหม่ใน localStorage
      localStorage.setItem("filters", JSON.stringify(updatedFilters));
      setCount(true);
      return updatedFilters;
    });
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start ?? undefined); // ตรวจสอบว่าค่าเป็น null หรือ undefined
    setEndDate(end ?? undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    refetch();
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [event.target.name]: event.target.value,
      };

      localStorage.setItem("filters", JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  const initializeFilters = () => {
    const savedOrderDetail = localStorage.getItem("orderDetail");
    const savedOrderDetailFilter = localStorage.getItem("filters");

    if (savedOrderDetail && savedOrderDetailFilter) {
      const x = OrderAll?.orderAll.filter(
        (order: any) => order?.Net_Price !== null
      );
      const y = OrderAll?.hisPayment.filter(
        (order: any) => order?.Net_Price !== null
      );
      handleOrderprevData(savedOrderDetail, x, y);
      return JSON.parse(savedOrderDetailFilter);
    } else if (savedOrderDetail) {
      const x = OrderAll?.orderAll.filter(
        (order: any) => order?.Net_Price !== null
      );
      const y = OrderAll?.hisPayment.filter(
        (order: any) => order?.Net_Price !== null
      );
      handleOrderprevData(savedOrderDetail, x, y);
      return {
        orderNo: "",
        eventName: "",
        customerName: "",
        customerPhone: "",
        status: "all",
        paymentStatus: "all",
        ticketNo: "",
        ticketType: "all",
      };
    } else if (savedOrderDetailFilter) {
      return JSON.parse(savedOrderDetailFilter);
    } else {
      return {
        orderNo: "",
        eventName: "",
        customerName: "",
        customerPhone: "",
        status: "all",
        paymentStatus: "all",
        ticketNo: "",
        ticketType: "all",
      };
    }
  };

  const [filters, setFilters] = useState(initializeFilters);

  const handleViewHistoryClick = (orderId: string) => {
    localStorage.setItem("orderId", orderId);
    setModalOpen(true);
  };

  const handleNavigateToOrderSite = async (order_id: string | number) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("ไม่สามารถเปิดหน้าพิมพ์ได้ กรุณาอนุญาต popup");
      return;
    }

    const response = await getViewTicketListbyOrderid(order_id);
    const latestTicketsMap = new Map();

    response.ticketList.forEach((ticket) => {
      if (
        !latestTicketsMap.has(ticket.ticket_id) ||
        new Date(ticket.Payment_Date7) >
          new Date(latestTicketsMap.get(ticket.ticket_id).Payment_Date7)
      ) {
        latestTicketsMap.set(ticket.ticket_id, ticket);
      }
    });

    const latestTickets = Array.from(latestTicketsMap.values());

    const ticketGroups = new Map<string, any[]>();
    latestTickets.forEach((ticket) => {
      const key = `${ticket.plan_id}-${ticket.ticket_no}`;
      if (!ticketGroups.has(key)) ticketGroups.set(key, []);
      ticketGroups.get(key)?.push(ticket);
    });

    let htmlContent = ``;
    for (let ticket of latestTickets) {
      const dataUrl = await QRCode.toDataURL(ticket.ticket_id.toString());
      const key = `${ticket.plan_id}-${ticket.ticket_no}`;
      const group = ticketGroups.get(key) || [];
      const totalInGroup = group.length;

      htmlContent += `
      <div style="text-align: center; page-break-after: always;">
        <img src="${dataUrl}" style="width:90%" />
        <p style="font-size: 40px; font-weight: bold;">${ticket.Event_Name}</p>
        <p style="font-size: 40px;">${ticket.Plan_Name} - ${
        ticket.ticket_no
      } (${ticket.ticket_line}/${totalInGroup})</p>
        <p style="font-size: 40px;">
          เวลา: ${new Date(ticket.Event_Date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })} - ${new Date(
        new Date(ticket.Event_Time).getTime() - 7 * 60 * 60 * 1000
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })} น.
        </p>
      </div>
    `;
    }

    // ✅ inject HTML
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print QR Codes</title>
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body onload="window.print(); window.onafterprint = () => window.close();">
        ${htmlContent}
      </body>
    </html>
  `);
    printWindow.document.close();

    // ✅ redirect หลักหลังจาก inject เสร็จ
    setTimeout(() => {
      window.location.replace("/all-orders");
    }, 500); // เผื่อ delay ให้ printWindow ทำงานก่อน
  };

  const handlePayCash = async (Order_id: number, amount: number) => {
    console.log("amount", amount, typeof amount);
    const Success = "/paid.png";
    Swal.fire({
      icon: "warning",
      html: `คุณต้องการชำระเป็น เงินสด<br>&nbsp;&nbsp;&nbsp;&nbsp;ยอดเงิน ${amount.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} บาท<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;หรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authAxiosClient?.post("/api/paysecond", {
            Order_id,
            amount,
          });
          console.log("paysecond response:", res?.data);
          // SwalSuccess("อัพเดทการชำระเรียบร้อย");

          Swal.fire({
            html: `
    <div style="text-align: center; position: relative;">
      <!-- ปุ่มกากบาท -->
      <button id="xCloseBtn" style="
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        border: none;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        padding: 10px;
        color: #999;
      ">&times;</button>

      <img src="${Success}" width="250" height="250" />
      <br/>
      <div style="display: grid;width: 490px;grid-template-columns: auto;align-items: center;justify-content:center ;">
        <button id="printQRBtn" style="
          margin-top: 20px;
          background-color: #CFB70B;
          color: black;
          font-weight: bold;
          font-size: 12px;
          height: 50px;
          border: none;
          padding: 0 20px;
          cursor: pointer;
          border-radius: 5px;
          width: 170px;
        ">
          <i class="fa fa-print" style="margin-right: 5px;"></i> Print QR
        </button>
      </div>
    </div>
  `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.hideLoading();

              const printBtn = document.getElementById("printQRBtn");
              const closeBtn = document.getElementById("closeBtn");
              const xCloseBtn = document.getElementById("xCloseBtn");

              if (printBtn) {
                printBtn.addEventListener("click", async () => {
                  await handleNavigateToOrderSite(orderDetail.at(0)?.Order_id);
                });
              }

              if (closeBtn || xCloseBtn) {
                const closeHandler = () => {
                  window.location.replace("/all-orders");
                };
                closeBtn?.addEventListener("click", closeHandler);
                xCloseBtn?.addEventListener("click", closeHandler);
              }
            },
          });
        } catch (error) {
          console.error("Error in claerStatusR:", error);
          Swal.fire({
            icon: "error",
            text: "เกิดข้อผิดพลาดในการชำระ",
          });
        }
      } else {
        console.log("User closed");
      }
    });
  };

  const handlePayQRCODE = async (Order_id: number, amount: number) => {
    const Success = "/paid.png";
    const confirmed = await Swal.fire({
      icon: "warning",
      html: `คุณต้องการชำระเป็น QR_CODE<br>&nbsp;&nbsp;&nbsp;&nbsp;ยอดเงิน ${amount.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} บาท<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;หรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ปิด",
    });

    if (!confirmed.isConfirmed) return;

    try {
      // ✅ เข้าร่วมห้องเฉพาะ order นี้ก่อน
      socketRef.current.emit("joinOrderRoom", Order_id);

      // ✅ เรียก API เพื่อสร้าง QR
      const res = await authAxiosClient.post("/api/create-qr", {
        orderId: Order_id,
        amount,
      });

      const { qrCodeUrl } = res.data;
      if (!qrCodeUrl) throw new Error("ไม่สามารถสร้าง QR Code ได้");

      // ✅ ส่ง QR ไปยังหน้าจอที่สอง
      socketRef.current.emit("orderCreated", {
        orderId: Order_id,
        qrCode: qrCodeUrl,
      });

      // ✅ แสดง QR พร้อมโหลด
      Swal.fire({
        title: "กำลังรอการชำระเงิน...",
        html: `<img src="${qrCodeUrl}" width="250" height="250" />
         <div style="margin-top: 10px;">กรุณาชำระเงินผ่านแอปธนาคารของคุณ</div>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "ปิด",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // ✅ ป้องกันการติด loop listener ซ้ำ
      socketRef.current.off("orderStatusUpdated");

      // ✅ รอรับสถานะอัปเดต
      socketRef.current.on("orderStatusUpdated", (payload: any) => {
        if (payload?.orderId === Order_id && payload?.status === 1) {
          Swal.fire({
            html: `
    <div style="text-align: center; position: relative;">
      <!-- ปุ่มกากบาท -->
      <button id="xCloseBtn" style="
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        border: none;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        padding: 10px;
        color: #999;
      ">&times;</button>

      <img src="${Success}" width="250" height="250" />
      <br/>
      <div style="display: grid;width: 490px;grid-template-columns: auto;align-items: center;justify-content:center ;">
        <button id="printQRBtn" style="
          margin-top: 20px;
          background-color: #CFB70B;
          color: black;
          font-weight: bold;
          font-size: 12px;
          height: 50px;
          border: none;
          padding: 0 20px;
          cursor: pointer;
          border-radius: 5px;
          width: 170px;
        ">
          <i class="fa fa-print" style="margin-right: 5px;"></i> Print QR
        </button>
      </div>
    </div>
  `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.hideLoading();

              const printBtn = document.getElementById("printQRBtn");
              const closeBtn = document.getElementById("closeBtn");
              const xCloseBtn = document.getElementById("xCloseBtn");

              if (printBtn) {
                printBtn.addEventListener("click", async () => {
                  await handleNavigateToOrderSite(orderDetail.at(0)?.Order_id);
                });
              }

              if (closeBtn || xCloseBtn) {
                const closeHandler = () => {
                  window.location.replace("/all-orders");
                };
                closeBtn?.addEventListener("click", closeHandler);
                xCloseBtn?.addEventListener("click", closeHandler);
              }
            },
          });
        }
      });
    } catch (error: any) {
      console.error("❌", error.message);
      Swal.fire({
        icon: "error",
        text: error.message || "เกิดข้อผิดพลาด",
      });
    }
  };

  // const handlePayQRCODE = async () => {};

  // const handleNavigateToOrderSite2 = async (order_id: string | number) => {
  // const orderIdStr = String(order_id); // Ensure order_id is a string

  // PRDODUCTION
  // window.open(
  //   `https://deedclub.appsystemyou.com/ConcertInfo/${orderIdStr}?token=${localStorage.getItem(
  //     "token"
  //   )}`,
  //   "_blank"
  // );
  //  UAT
  // window.open(
  //   `https://deedclub-uat.appsystemyou.com/ConcertInfo/${orderIdStr}?token=${localStorage.getItem(
  //     "token"
  //   )}`,
  //   "_blank"
  // );
  // test
  // window.open(
  //   `http://localhost:3010/ConcertInfo/${orderIdStr}?token=${localStorage.getItem(
  //     "token"
  //   )}`,
  //   "_blank"
  // );
  // };

  const PaymentGateway = async (chargeId: any) => {
    console.log("orderDetail.at(0)", orderDetail.at(0));
    console.log("chargeId", chargeId);
    const time: Date = new Date();
    console.log(`Current time is: ${time.toLocaleTimeString()}`);
    const savedLocale = JSON.parse(localStorage.getItem("emmp") || "{}");
    const name = savedLocale?.Emp_Name || "Unknown";
    console.log("name", name);
    if (!chargeId) {
      console.error("Invalid charge ID");
      Swal.fire({
        icon: "warning",
        text: "ตรวจสอบพบมีการสร้าง Order แต่ยังไม่ได้กดปุ่มชำระเงินคุณต้องการยกเลิกคำสั่งซื้อหรือไม่",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ปิด",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const orderId = orderDetail.at(0).Order_id;
          const Remark = `ตรวจสอบพบมีการสร้าง Order แต่ยังไม่ได้กดปุ่มชำระเงิน`;
          try {
            const res = await authAxiosClient?.post("/api/claerStatusR", {
              orderId,
              chargeId,
              Remark,
              time,
              name,
            });
            console.log("claerStatusR response:", res?.data);
            SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
            setTimeout(() => {
              window.location.replace("/all-orders");
            }, 1500);
          } catch (error) {
            console.error("Error in claerStatusR:", error);
            Swal.fire({
              icon: "error",
              text: "เกิดข้อผิดพลาดในการยกเลิกสถานะ",
            });
          }
        } else {
          console.log("User closed");
        }
      });
      return;
    }

    try {
      const response = await authAxiosClient?.post("/api/getChargeDetails", {
        chargeId,
      });
      console.log("Charge details response:", response);

      if (response.status !== 200) {
        throw new Error(
          `Failed to retrieve charge details, status: ${response.status}`
        );
      }

      const result = response?.data;

      if (result.success) {
        console.log("Charge detail:", result?.data);
        if (result?.data.paid !== false) {
          const amount: number = Number(result?.data.amount) / 100;
          const totalSum = orderDetail.reduce(
            (acc, order) => acc + order.Total_Price,
            0
          );
          const paymentOption: number = (amount / totalSum) * 100;
          const time_paid = result?.data.paid_at;
          const ref_number1 =
            (result?.data?.source as any)?.provider_references
              ?.reference_number_1 || "";
          const orderId = orderDetail.at(0).Order_id;
          const paymentMethod = (result?.data?.source as any)?.type;
          const validPaymentMethods = [
            "mobile_banking_bay",
            "mobile_banking_bbl",
            "mobile_banking_ktb",
            "mobile_banking_kbank",
            "mobile_banking_scb",
            "promptpay",
          ];

          if (!paymentMethod) {
            console.log("Payment method is null");
          } else if (validPaymentMethods.includes(paymentMethod)) {
            if (paymentMethod === "promptpay") {
              console.log("promptpay", paymentMethod);
              const PaymentMethod = "promptpay";
              const res = await authAxiosClient?.post("/api/AddHisPayment", {
                orderId,
                orderDetail,
                totalSum,
                amount,
                PaymentMethod,
                paymentOption,
                time_paid,
                chargeId,
                ref_number1,
              });
              console.log("AddHisPayment response:", res?.data);
              SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
              setTimeout(() => {
                window.location.replace("/all-orders");
              }, 1500);
            } else {
              console.log("E-Banking", paymentMethod);
              const PaymentMethod = "E-Banking";
              const res = await authAxiosClient?.post("/api/AddHisPayment", {
                orderId,
                orderDetail,
                totalSum,
                amount,
                PaymentMethod,
                paymentOption,
                time_paid,
                chargeId,
                ref_number1,
              });
              console.log("AddHisPayment response:", res?.data);
              SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
              setTimeout(() => {
                window.location.replace("/all-orders");
              }, 1500);
            }
          } else if (result?.data?.card) {
            console.log("card", result?.data?.card);
            const PaymentMethod = "Credit Card";
            const res = await authAxiosClient?.post("/api/AddHisPayment", {
              orderId,
              orderDetail,
              totalSum,
              amount,
              PaymentMethod,
              paymentOption,
              time_paid,
              chargeId,
              ref_number1,
            });
            console.log("AddHisPayment response:", res?.data);
            SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
            setTimeout(() => {
              window.location.replace("/all-orders");
            }, 1500);
          } else {
            console.log("Other payment method not recognized");
          }
        } else if (result?.data.failure_code) {
          console.log("Charge details:", result?.data.failure_code);

          Swal.fire({
            icon: "warning",
            text: "ตรวจสอบการจ่ายเป็น Pendding ใน Payment Gateway คุณต้องการยกเลิกคำสั่งซื้อเลยหรือไม่",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ปิด",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const orderId = orderDetail.at(0).Order_id;
              const Remark = `ตรวจสอบการจ่ายเป็น Pendding ใน Payment Gateway`;
              try {
                const res = await authAxiosClient?.post("/api/claerStatusR", {
                  orderId,
                  chargeId,
                  Remark,
                  time,
                  name,
                });
                console.log("claerStatusR response:", res?.data);
                SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
                setTimeout(() => {
                  window.location.replace("/all-orders");
                }, 1500);
              } catch (error) {
                console.error("Error in claerStatusR:", error);
                Swal.fire({
                  icon: "error",
                  text: "เกิดข้อผิดพลาดในการยกเลิกสถานะ",
                });
              }
            } else {
              console.log("User closed");
            }
          });
        } else {
          console.log("Waiting for payment...");
          Swal.fire({
            icon: "warning",
            text: "ตรวจสอบการจ่ายเป็น Pendding ใน Payment Gateway คุณต้องการยกเลิกคำสั่งซื้อเลยหรือไม่",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ปิด",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const orderId = orderDetail.at(0).Order_id;
              const Remark = `ตรวจสอบการจ่ายเป็น Pendding ใน Payment Gateway`;
              try {
                const res = await authAxiosClient?.post("/api/claerStatusR", {
                  orderId,
                  chargeId,
                  Remark,
                  time,
                  name,
                });
                console.log("claerStatusR response:", res?.data);
                SwalSuccess("อัพเดทประวัติการชำระเรียบร้อย");
                setTimeout(() => {
                  window.location.replace("/all-orders");
                }, 1500);
              } catch (error) {
                console.error("Error in claerStatusR:", error);
                Swal.fire({
                  icon: "error",
                  text: "เกิดข้อผิดพลาดในการยกเลิกสถานะ",
                });
              }
            } else {
              console.log("User closed");
            }
          });
        }
      } else {
        console.error("Error retrieving charge details:", response);
        Swal.fire({
          icon: "error",
          text: "ไม่สามารถดึงข้อมูลการชำระเงินได้",
        });
      }
    } catch (error: any) {
      console.error(
        "Failed to retrieve charge details:",
        error.message || error
      );
      Swal.fire({
        icon: "error",
        text: "เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน",
      });
    }
  };

  const handletime = (x) => {
    const adjustedDate = dayjs(x).subtract(7, "hour");
    const formattedDateTime = adjustedDate.format("DD/MM/BBBB - HH:mm น.");
    return formattedDateTime;
  };

  const handleOrderClick = async (orderNo: any) => {
    localStorage.setItem("orderDetail", orderNo);
    setSelectedOrderNo(orderNo);
    // console.log("orderHData", orderHData);

    const latestOrders = Object.values(
      orderHData
        ?.filter((order) => order.Order_no === orderNo)
        .reduce((acc, current) => {
          const key = current.Event_Stc_id;

          if (!acc[key]) {
            acc[key] = current;
          } else {
            const existingPaymentDate = new Date(acc[key].Payment_Date7);
            const currentPaymentDate = new Date(current.Payment_Date7);
            if (currentPaymentDate > existingPaymentDate) {
              acc[key] = current;
            }
          }

          return acc;
        }, {})
    );
    setOrderDetail(latestOrders);

    const h = orderDData
      ?.filter((order) => order.Order_no === orderNo)
      .sort(
        (a, b) =>
          new Date(a.Payment_Date7).getTime() -
          new Date(b.Payment_Date7).getTime()
      );
    setOrderHispayDetail(h);
  };

  function formatNumberWithCommas(number: number | string): string {
    const num = typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(num)) return "0.00 ฿";

    const parts = num.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${integerPart}.${parts[1]} ฿`;
  }

  const filteredOrders = orderHData
    ?.filter((order) => {
      const matchesSearch =
        String(order.Event_Name)
          .toLowerCase()
          .includes(filters.eventName?.toLowerCase() || "") &&
        String(order.Order_no)
          .toLowerCase()
          .includes(filters.orderNo?.toLowerCase() || "") &&
        String(order.Cust_name)
          .toLowerCase()
          .includes(filters.customerName?.toLowerCase() || "") &&
        String(order.Cust_tel)
          .toLowerCase()
          .includes(filters.customerPhone?.toLowerCase() || "") &&
        String(order.TicketNo_List)
          .toLowerCase()
          .includes(filters.ticketNo?.toLowerCase() || "");

      const matchesStatusOrder =
        (filters.status === "สำเร็จ" && order.Order_Status === 1) ||
        (filters.status === "มีแก้ไข" && order.Order_Status === 2) ||
        (filters.status === "ยกเลิก" && order.Order_Status === 13) ||
        (filters.status === "ไม่สำเร็จเพราะติด R" &&
          order.Order_Status === 4) ||
        (filters.status === "ไม่สำเร็จจาก Omise" && order.Order_Status === 5) ||
        filters.status === "all";

      const matchesStatusPayment =
        (filters.paymentStatus === "สำเร็จ" && order.Is_Balance === 0) ||
        (filters.paymentStatus === "ค้างจ่าย" && order.Is_Balance !== 0) ||
        filters.paymentStatus === "all";

      const orderDatetime = new Date(order.Order_datetime);
      const normalizedStartDate = startDate
        ? new Date(startDate.setHours(0, 0, 0, 0))
        : null;
      const normalizedEndDate = endDate
        ? new Date(endDate.setHours(23, 59, 59, 999))
        : null;

      const matchesDate =
        (!normalizedStartDate || orderDatetime >= normalizedStartDate) &&
        (!normalizedEndDate || orderDatetime <= normalizedEndDate);

      return (
        matchesSearch &&
        matchesStatusOrder &&
        matchesStatusPayment &&
        matchesDate
      );
    })
    .reduce((acc, current) => {
      const existingIndex = acc.findIndex(
        (order) => order.Order_id === current.Order_id
      );

      if (existingIndex !== -1) {
        const existingOrder = acc[existingIndex];

        const combinedList = [
          ...existingOrder.TicketNo_List.split(",").map((s) => s.trim()),
          ...current.TicketNo_List.split(",").map((s) => s.trim()),
        ];

        const uniqueList = [...new Set(combinedList)].join(", ");

        acc[existingIndex] = {
          ...existingOrder,
          TicketNo_List: uniqueList,
        };
      } else {
        acc.push({ ...current });
      }

      return acc;
    }, [])
    .map((order) => {
      const updatedTicketNoList = [
        ...new Set(
          order.TicketNo_List.split(",").map((no) =>
            no.trim().startsWith("A") ? "Walk-in" : no.trim()
          )
        ),
      ].join(", ");

      return {
        ...order,
        TicketNo_List: updatedTicketNoList,
      };
    });

  console.log("filteredOrders", filteredOrders);

  const totalOrders = filteredOrders?.length;

  const dataP = Object.values(
    orderDData.filter((order) => order.Event_Id === filteredOrders[0]?.Event_Id)
  );
  // console.log("dataP", dataP);

  const dataP2 = Object.values(
    orderDData
      .filter((order) => order.Event_Id === filteredOrders[0]?.Event_Id)
      .reduce((acc, current) => {
        if (
          !acc[current.Order_id] ||
          current.His_Payment_id < acc[current.Order_id].His_Payment_id
        ) {
          acc[current.Order_id] = current;
        }
        return acc;
      }, {})
  );

  // console.log("dataP2", dataP2);

  const totalNetPriceWithZeroBalance = dataP2?.reduce<number>(
    (sum, order) => sum + order.Net_Price,
    0
  );

  const totalNetPrice = dataP?.reduce<number>(
    (sum, order) => sum + order.Total_Pay,
    0
  );

  const OutstandingPayment3 = totalNetPriceWithZeroBalance - totalNetPrice;

  const handleClearFilters = async () => {
    setEvents(null);
    setIsFetching(false);
    initialize();
  };

  const totalSeats = orderDetail?.reduce(
    (sum, order) => sum + order.Total_stc,
    0
  );

  const totalPrice = orderDetail?.reduce(
    (sum, order) => sum + order.Total_Price,
    0
  );

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    const formatBuddhistYear = (dateString) => {
      // console.log("Input dateString:", dateString);

      // แยกวันที่ช่วงวันที่ออกจากกัน (ถ้ามี)
      const [startDateStr, endDateStr] = dateString.split(" - ");

      // ตรวจสอบว่ามีค่า startDateStr หรือไม่
      if (!startDateStr) {
        return "Invalid date";
      }

      // แปลง startDateStr เป็น moment object
      const parsedStartDate = moment(
        startDateStr,
        ["YYYY-MM-DD", "DD/MM/YYYY"],
        true
      );
      if (!parsedStartDate.isValid()) {
        console.error("Invalid start date format detected for:", startDateStr);
        return "Invalid date"; // แสดง error ถ้า startDateStr ไม่สามารถแปลงได้
      }

      // แปลง endDateStr เป็น moment object ถ้ามีค่า
      let parsedEndDate = null;
      if (endDateStr) {
        parsedEndDate = moment(endDateStr, ["YYYY-MM-DD", "DD/MM/YYYY"], true);
        if (!parsedEndDate.isValid()) {
          console.error("Invalid end date format detected for:", endDateStr);
          return ""; // แสดง error ถ้า endDateStr ไม่สามารถแปลงได้
        }
      }

      // console.log("Parsed startDate using moment:", parsedStartDate);
      if (parsedEndDate) {
        // console.log("Parsed endDate using moment:", parsedEndDate);
      }

      const formattedStartDate = parsedStartDate
        .format("DD/MM/YYYY")
        .replace(/\d{4}/, (year) => (parseInt(year) + 543).toString());

      let formattedEndDate = null;
      if (parsedEndDate) {
        formattedEndDate = parsedEndDate
          .format("DD/MM/YYYY")
          .replace(/\d{4}/, (year) => (parseInt(year) + 543).toString());
      }

      if (formattedEndDate) {
        return `${formattedStartDate} - ${formattedEndDate}`;
      }

      return formattedStartDate;
    };

    return (
      <input
        style={{
          padding: "10px",
          borderRadius: "4px",
          border: "none",
          fontSize: "16px",
          width: "200px",
          height: "30px",
          textAlign: "start",
          outline: "none",
        }}
        onClick={onClick}
        ref={ref}
        value={value ? formatBuddhistYear(value) : ""}
        readOnly
      />
    );
  });

  useEffect(() => {
    if (events) {
      console.log("ข้อมูล data เปลี่ยนไป:", events);
    }
  }, [events]);

  useEffect(() => {
    if (isFetching) {
      console.log("กำลังดึงข้อมูล...");
    } else if (events) {
      console.log("ข้อมูลโหลดเสร็จแล้ว");
      setCount(true);
    }
  }, [isFetching, events]);

  useEffect(() => {
    initialize();
  }, []);

  const hasInitialized = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      let orderNo = localStorage.getItem("Order_no");

      // 🔁 ถ้าไม่มีค่าใน localStorage ให้ fallback ไป order ล่าสุด
      if (!orderNo && orderHData.length > 0) {
        const latestOrder = [...orderHData].sort(
          (a, b) =>
            new Date(b.Order_datetime).getTime() -
            new Date(a.Order_datetime).getTime()
        )[0];

        if (latestOrder) {
          orderNo = latestOrder.Order_no;
          localStorage.setItem("Order_no", orderNo); // เก็บไว้ใช้ต่อไป
        }
      }

      // ✅ ถ้ามี orderNo แล้ว และข้อมูลพร้อม ให้โหลด
      if (orderNo && orderHData.length && orderDData.length) {
        await handleOrderClick(orderNo);
      }
    };

    if (!hasInitialized.current && orderHData.length && orderDData.length) {
      fetchOrder();
      hasInitialized.current = true;
    }
  }, [orderHData, orderDData]);

  useEffect(() => {
    if (!newMove.From_Zone) return;

    const tables = orderDetail
      .filter((item) => item.Plan_Name === newMove.From_Zone)
      .flatMap((item) => item.TicketNo_List.split(",").map((no) => no.trim()));

    const uniqueTables = [...new Set(tables)];

    if (uniqueTables.length === 1) {
      setNewMove((prev) => ({
        ...prev,
        From_Table: uniqueTables[0],
      }));
    }
  }, [newMove.From_Zone, orderDetail]);

  useEffect(() => {
    const checkMoveStatus = async () => {
      if (orderDetail?.length) {
        const status = await handleOrderStatus(
          orderDetail[0]?.OrderStatus_Name,
          orderDetail[0]
        );
        setDisplayOrderStatus(status);
      }
    };
    checkMoveStatus();
  }, [orderDetail]);

  return (
    <div
      className="all-orders-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="คำสั่งซื้อทั้งหมด" />

      <Container maxWidth={false} sx={{ padding: 1, marginTop: "5px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <ShoppingCartIcon
                sx={{ width: 70, height: 70 }}
                alt="คำสั่งซื้อทั้งหมด"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>
                    คำสั่งซื้อทั้งหมด
                  </Typography>
                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {totalOrders}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Avatar
                src="/money.svg"
                alt="ยอดขาย"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>
                    ยอดขายทั้งหมด
                  </Typography>

                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(totalNetPriceWithZeroBalance)}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Avatar
                src="/money.svg"
                alt="ยอดขาย"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>ชำระแล้ว</Typography>

                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(totalNetPrice)}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Avatar
                src="/not-pay.svg"
                alt="ค้างชำระ"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>ค้างชำระ</Typography>
                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(OutstandingPayment3)}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <div
        style={{
          backgroundColor: "#f7f7f7",
        }}
      >
        <Container maxWidth={false} sx={{ padding: 2, marginTop: "10px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                style={{ minWidth: 125 }}
              >
                <InputLabel>ชื่องาน</InputLabel>
                <Select
                  label="ชื่องาน"
                  name="eventName"
                  value={filters.eventName}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {evntDetail?.map((item, index) => (
                    <MenuItem key={index + 1} value={item.Event_Name}>
                      {item.Event_Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #bebebf",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  position: "relative",
                  minWidth: "0",
                  padding: "0",
                  margin: "0",
                }}
              >
                <label
                  htmlFor="custom-datepicker"
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0px",
                    fontWeight: 400,
                    color: "rgba(0, 0, 0, 0.6)",
                    fontFamily: '"Noto Sans Thai", sans-serif',
                    lineHeight: "1.4375em",
                    padding: 0,
                    position: "absolute",
                    display: "block",
                    transformOrigin: "top left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    left: "0px",
                    top: "0px",
                    transform: "translate(14px, -9px) scale(0.75)",
                    background: "#f6f7f7",
                    width: "fit-content",
                    zIndex: 1,
                  }}
                >
                  ช่วงวันที่ใบสั่งซื้อ
                </label>

                <DatePicker
                  className="custom-datepicker"
                  selected={startDate}
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale={th}
                  isClearable
                  showMonthDropdown
                  useShortMonthInDropdown
                  dropdownMode="select"
                  selectsRange
                  customInput={<CustomInput />}
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div>
                      <div
                        style={{
                          margin: 10,
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          style={{ fontSize: 18 }}
                        >
                          {"<"}
                        </button>
                        <span style={{ fontSize: 16 }}>
                          {format(date, "MMMM", { locale: th })}{" "}
                          {moment(date).year() + 543}
                        </span>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          style={{ fontSize: 18 }}
                        >
                          {">"}
                        </button>
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Dropdown สำหรับเลือกเดือน */}
                        <select
                          value={date.getMonth()}
                          onChange={({ target: { value } }) =>
                            changeMonth(Number(value))
                          }
                          style={{
                            fontSize: 16,
                            margin: "0 5px",
                            height: 40,
                            width: "auto",
                          }}
                        >
                          {Array.from({ length: 12 }, (_, index) => {
                            const monthDate = new Date(
                              date.getFullYear(),
                              index,
                              1
                            );
                            return (
                              <option key={index} value={index}>
                                {format(monthDate, "MMMM", { locale: th })}
                              </option>
                            );
                          })}
                        </select>

                        {/* Dropdown สำหรับเลือกปี */}
                        <select
                          value={date.getFullYear()}
                          onChange={({ target: { value } }) =>
                            changeYear(Number(value))
                          }
                          style={{
                            fontSize: 16,
                            margin: "0 5px",
                            height: 40,
                            width: "auto",
                          }}
                        >
                          {Array.from({ length: 20 }, (_, index) => {
                            const year = moment().year() - 5 + index; // ปรับช่วงปีที่ต้องการให้เลือก
                            return (
                              <option key={index} value={year}>
                                {year + 543}{" "}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                />
              </div>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  variant="outlined"
                  label="เลขคำสั่งซื้อ"
                  name="orderNo"
                  value={filters.orderNo}
                  onChange={handleSearchChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                        width: "120px",
                        height: 30,
                      },
                    },
                  }}
                />

                <TextField
                  variant="outlined"
                  label="เบอร์โต๊ะ"
                  name="ticketNo"
                  value={filters.ticketNo}
                  onChange={handleSearchChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                        width: "120px",
                        height: 30,
                      },
                    },
                  }}
                />

                <TextField
                  variant="outlined"
                  label="ชื่อลูกค้า"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleSearchChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", // Remove the inner border
                        transform: "translateY(5px)",
                        width: "120px",
                        height: 30,
                      },
                    },
                  }}
                />

                <TextField
                  variant="outlined"
                  label="เบอร์โทร"
                  name="customerPhone"
                  value={filters.customerPhone}
                  onChange={handleSearchChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", // Remove the inner border
                        transform: "translateY(5px)",
                        width: "120px",
                        height: 30,
                      },
                    },
                  }}
                />

                <FormControl
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  style={{ minWidth: 125 }}
                >
                  <InputLabel>สถานะคำสั่งซื้อ</InputLabel>
                  <Select
                    label="สถานะ"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">ทั้งหมด</MenuItem>
                    <MenuItem value="สำเร็จ">สำเร็จ</MenuItem>
                    <MenuItem value="มีแก้ไข">มีแก้ไข</MenuItem>
                    <MenuItem value="ยกเลิก">ยกเลิก</MenuItem>
                    <MenuItem value="ไม่สำเร็จเพราะติด R">
                      ไม่สำเร็จเพราะติด R
                    </MenuItem>
                    <MenuItem value="ไม่สำเร็จจาก Omise">
                      ไม่สำเร็จจาก Omise
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  style={{ minWidth: 125 }}
                >
                  <InputLabel>สถานะจ่าย</InputLabel>
                  <Select
                    label="สถานะจ่าย"
                    name="paymentStatus"
                    value={filters.paymentStatus}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">ทั้งหมด</MenuItem>
                    <MenuItem value="สำเร็จ">จ่ายครบ</MenuItem>
                    <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearFilters}
                sx={{
                  backgroundColor: "#CFB70B",
                  width: "160px",
                  height: "45px",
                  color: "black",
                  fontSize: "15px",
                  "&:hover": {
                    backgroundColor: "#CFB70B",
                  },
                  flexShrink: 0,
                }}
              >
                ค้นหา
              </Button>
              {filteredOrders?.length === 0 ? (
                <p style={{ color: "red", marginLeft: 10 }}>
                  ผลการค้นหา 0 รายการ
                </p>
              ) : (
                <p style={{}}></p>
              )}
            </Box>
          </Box>
        </Container>
      </div>

      {/* Table Component */}
      <div
        style={{
          display: "flex",
          maxHeight: "70vh",
        }}
      >
        <div style={{ width: "1030px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              justifyContent: " space-between",
              alignItems: "center",
            }}
          >
            <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
              คำสั่งซื้อทั้งหมด
            </p>
            <div>
              <Button
                onClick={() => {
                  localStorage.removeItem("Order_no");
                  setWalkinModalOpen(true);
                }}
                variant="contained"
                style={{
                  backgroundColor: "#CFB70B",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "12px",
                  height: "50px",
                }}
              >
                ซื้อบัตรหน้างาน
              </Button>
            </div>
          </div>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: "0" }}
            style={{ maxHeight: "68vh", overflowY: "auto" }}
          >
            <Table
              stickyHeader
              sx={{
                tableLayout: "fixed",
                display: "table-cell",
              }}
            >
              <TableHead sx={{ backgroundColor: "#11131A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "60px",
                      maxWidth: "60px",
                      padding: "5px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    ลำดับ
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "170px",
                      maxWidth: "400px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2, // ใช้ความกว้างแบบสัดส่วน
                    }}
                  >
                    ชื่องาน
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                      minWidth: "85px",
                      maxWidth: "85px",
                    }}
                  >
                    เลขคำสั่งซื้อ
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "130px",
                      maxWidth: "130px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    ชื่อลูกค้า
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "80px",
                      maxWidth: "80px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    เบอร์โทร
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "80px",
                      maxWidth: "80px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    เบอร์โต๊ะ
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "65px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    สถานะ Order
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "65px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    สถานะจ่าย
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order: any, index: number) => {
                  let paymentStatusLabel;
                  let paymentStatusBgColor;

                  if (order.Order_Status === 1) {
                    if (order.Is_Balance === 0) {
                      paymentStatusLabel = "ชำระครบ";
                      paymentStatusBgColor = `${paymentStatusBgColor0}`;
                    } else if (order.Is_Balance > 0) {
                      paymentStatusLabel = "ค้างจ่าย";
                      paymentStatusBgColor = `${paymentStatusBgColor1}`;
                    }
                  } else {
                    paymentStatusLabel = "ไม่ระบุ";
                    paymentStatusBgColor = `${paymentStatusBgUnknown}`;
                  }

                  return (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor:
                          selectedOrderNo === order.Order_no
                            ? `${selectedColor}`
                            : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        localStorage.setItem("Order_no", order.Order_no);
                        handleOrderClick(order.Order_no);
                      }}
                    >
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          minWidth: "60px",
                          maxWidth: "60px",
                          padding: "5px",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "left",
                          fontWeight: "bold",
                          minWidth: "180px",
                          maxWidth: "180px",
                        }}
                      >
                        {order.Event_Name}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "900px",
                        }}
                      >
                        {order.Order_no}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "left",
                          minWidth: "130px",
                          maxWidth: "130px",
                        }}
                      >
                        {order.Cust_name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center", width: "50px" }}>
                        {order.Cust_tel}
                      </TableCell>
                      <TableCell style={{ textAlign: "center", width: "50px" }}>
                        {order.TicketNo_List}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "18px",
                            textAlign: "center",
                            display: "inline-block",
                            width: "65px",
                            minWidth: "65px",
                            maxWidth: "65px",
                            backgroundColor: `${order.OrderSetColour}`,
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.OrderStatus_Name}
                        </div>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            border:
                              paymentStatusLabel === "ไม่ระบุ"
                                ? "transparent"
                                : "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "18px",
                            textAlign: "center",
                            display: "inline-block",
                            width: "65px",
                            minWidth: "65px",
                            maxWidth: "65px",
                            backgroundColor:
                              paymentStatusLabel === "ไม่ระบุ"
                                ? "transparent"
                                : paymentStatusBgColor,
                            color: "#fff",
                          }}
                        >
                          {paymentStatusLabel === "ไม่ระบุ"
                            ? ``
                            : paymentStatusLabel}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ marginLeft: 10, maxWidth: "35vw" }}>
          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            รายละเอียด
          </p>
          <div style={{ width: "auto" }}>
            {orderDetail ? (
              <div>
                <div
                  style={{
                    color: "#000",
                    border: " 1px solid ",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "30% 26% 30% 15% 11%",
                        marginBottom: 20,
                        justifyItems: "flex-start",
                        alignItems: "center",
                        width: "30vw",
                      }}
                    >
                      <p>
                        <strong>ชื่องาน:</strong>
                        <br />
                        {orderDetail.at(0)?.Event_Name}
                      </p>
                      <p>
                        <strong>เวลาเริ่มงาน:</strong>
                        <br />
                        <span style={{ width: 100 }}>
                          {orderDetail?.length === 0
                            ? ``
                            : handletime(orderDetail.at(0)?.Event_Time)}
                        </span>
                      </p>

                      <p>
                        <strong>Plan_Name:</strong>
                        <br />
                        <span>
                          {orderDetail?.length === 0
                            ? ``
                            : `${orderDetail?.map((data) => data?.Plan_Name)}`}
                        </span>
                      </p>
                      <p style={{ textAlign: "center" }}>
                        <strong>จำนวนที่นั่ง:</strong>
                        <br />
                        {totalSeats}
                      </p>
                      <p>
                        <strong>ยอดสุทธิ:</strong>
                        <br />
                        {formatNumberWithCommas(totalPrice)}
                      </p>

                      <p>
                        <strong>สถานะคำสั่งซื้อ:</strong>
                        <br />
                        <span
                          style={{
                            color: ` ${orderDetail.at(0)?.OrderSetColour}`,
                            fontWeight: "bold",
                          }}
                        >
                          {displayOrderStatus}{" "}
                          {orderDetail.at(0)?.OrderStatus_Name === "ยกเลิก"
                            ? `/ โดย ${orderDetail.at(0)?.Cancel_By}`
                            : ""}
                        </span>
                      </p>
                      <p>
                        <strong>เลขคำสั่งซื้อ:</strong>
                        <br />
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {orderDetail.at(0)?.Order_no}
                        </span>
                      </p>
                      <p>
                        <strong>เวลาสั่งซื้อ:</strong>
                        <br />
                        {orderDetail?.length === 0
                          ? ``
                          : handletime(orderDetail.at(0)?.Order_datetime)}
                      </p>
                      <p></p>
                      <p></p>
                      {orderDetail.at(0)?.OrderStatus_Name === "ยกเลิก" ? (
                        <p>
                          <strong>เวลายกเลิก:</strong>
                          <br />
                          {orderDetail?.length === 0
                            ? ``
                            : handletime(orderDetail.at(0)?.Cancel_Date)}
                        </p>
                      ) : null}
                      {orderDetail.at(0)?.OrderStatus_Name === "ยกเลิก" ? (
                        <p style={{ width: "380px" }}>
                          <strong>สาเหตุ:</strong>
                          <br />
                          {orderDetail?.length === 0
                            ? ``
                            : orderDetail.at(0)?.Remark_1}
                        </p>
                      ) : null}

                      {/* <p>
                        <strong>line_id:</strong>
                        <br />
                        {orderDetail?.length === 0
                          ? ``
                          : `${orderDetail.at(0)?.Cust_line}`}
                      </p> */}
                    </div>
                  </div>

                  <div
                    style={
                      (orderHispayDetail &&
                        orderHispayDetail.at(0)?.Total_Balance === 0) ||
                      orderDetail[0]?.Order_Status === 4
                        ? {
                            display: "grid",
                            position: "relative",
                          }
                        : {
                            display: "grid",
                            position: "relative",
                          }
                    }
                  >
                    {orderDetail.length !== 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto auto",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className=""
                          style={
                            orderHispayDetail &&
                            orderHispayDetail.at(0)?.Total_Balance !== 0 &&
                            orderDetail[0]?.Order_Status !== 4
                              ? {
                                  width: "237px",
                                  display: "grid",
                                  justifyContent: "space-between",
                                  gridTemplateColumns: "auto auto ",
                                }
                              : {
                                  width: "240px",
                                  display: "grid",
                                  justifyContent: "space-between",
                                  gridTemplateColumns: "auto auto ",
                                }
                          }
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleViewHistoryClick(
                                orderDetail.at(0)?.Order_id
                              )
                            }
                            style={{ width: 110, height: 50 }}
                          >
                            ดูรายละเอียด
                          </Button>
                          {orderHispayDetail.length > 0 ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={
                                () => handleOpenDialog(orderDetail)
                                // orderDetail.at(0)?.Order_id
                              }
                              style={{ width: 110, height: 50 }}
                              // disabled={true}
                            >
                              ย้ายโต๊ะ
                            </Button>
                          ) : orderDetail[0]?.Order_Status === 4 ? (
                            <Button
                              variant="contained"
                              // color="primary"
                              onClick={() =>
                                PaymentGateway(
                                  orderDetail.at(0)?.ORD_H_Last_Charge_ID
                                )
                              }
                              style={{
                                width: 110,
                                height: 50,
                                backgroundColor: "#CFB70B",
                                color: "black",
                              }}
                            >
                              ตรวจสอบจ่าย
                            </Button>
                          ) : null}

                          {/* {orderDetail[0]?.Order_Status === 4 ? (
                            <Button
                              variant="contained"
                              // color="primary"
                              onClick={() =>
                                PaymentGateway(
                                  orderDetail.at(0)?.ORD_H_Last_Charge_ID
                                )
                              }
                              style={{
                                width: 110,
                                height: 50,
                                backgroundColor: "#CFB70B",
                                color: "black",
                              }}
                            >
                              ตรวจสอบจ่าย
                            </Button>
                          ) : null} */}
                        </div>

                        <div
                          style={{
                            // width: "247px",
                            display: "grid",
                            justifyContent: "space-between",
                            gridTemplateColumns: "auto auto",
                          }}
                        >
                          {orderHispayDetail.length > 0 &&
                          orderHispayDetail.at(-1)?.Total_Balance === 0 ? (
                            <Button
                              onClick={() => {
                                handleNavigateToOrderSite(
                                  orderDetail.at(0)?.Order_id
                                );
                              }}
                              variant="contained"
                              style={{
                                backgroundColor: "#CFB70B",
                                color: "#000",
                                fontWeight: "bold",
                                fontSize: "12px",
                                height: "50px",
                              }}
                              startIcon={<FaPrint style={{ color: "black" }} />}
                            >
                              Print QR
                            </Button>
                          ) : null}

                          {orderHispayDetail.length > 0 &&
                          orderHispayDetail.at(-1)?.Total_Balance !== 0 &&
                          orderDetail[0]?.Order_Status !== 4 ? (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "auto auto",
                                width: "375px",
                                justifyContent: "space-between",
                              }}
                            >
                              <Button
                                onClick={() =>
                                  handlePayCash(
                                    orderDetail.at(0)?.Order_id,
                                    orderDetail.at(0)?.Is_Balance
                                  )
                                }
                                variant="contained"
                                style={{
                                  backgroundColor: "#CFB70B",
                                  color: "#000",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  height: "50px",
                                }}
                                startIcon={
                                  <FaMoneyBill style={{ color: "black" }} />
                                }
                              >
                                ชำระส่วนที่เหลือเงินสด
                              </Button>

                              <Button
                                onClick={() =>
                                  handlePayQRCODE(
                                    orderDetail.at(0)?.Order_id,
                                    orderDetail.at(0)?.Is_Balance
                                  )
                                }
                                variant="contained"
                                style={{
                                  backgroundColor: "#CFB70B",
                                  color: "#000",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  height: "50px",
                                }}
                                startIcon={
                                  <FaMoneyBill style={{ color: "black" }} />
                                }
                              >
                                ชำระส่วนที่เหลือ QRCODE
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            ประวัติการชำระเงิน
          </p>
          <div
            style={{
              display: "inline-block",
              maxWidth: "35vw",
              overflowX: "auto",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "0" }}
              style={{ maxHeight: 300, width: "auto" }}
            >
              <Table style={{ display: "grid", width: "min-content" }}>
                <TableHead sx={{ backgroundColor: "#11131A" }}>
                  <TableRow style={{ display: "flex", width: "100%" }}>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "75px",
                        maxWidth: "75px",
                      }}
                    >
                      สถานะจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "140px",
                        maxWidth: "140px",
                      }}
                    >
                      วันที่เวลาจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "91px",
                      }}
                    >
                      ช่องทางการจ่าย
                    </TableCell>

                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ยอดจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ยอดค้างจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ธนาคาร
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "175px",
                      }}
                    >
                      Charge_Id
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      Ref_Number1
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orderHispayDetail.map((order: any, index: number) => {
                    let paymentStatusLabel;
                    let paymentStatusBgColor;

                    if (order.Order_Status === 1) {
                      if (order.Total_Balance === 0) {
                        paymentStatusLabel = "ชำระครบ";
                        paymentStatusBgColor = "#28a745";
                      } else if (order.Total_Balance > 0) {
                        paymentStatusLabel = "ค้างจ่าย";
                        paymentStatusBgColor = "#ffc107";
                      }
                    } else {
                      paymentStatusLabel = "ไม่ระบุ";
                      paymentStatusBgColor = "#f8f9fa";
                    }

                    return (
                      <TableRow
                        key={order.index}
                        style={{
                          display: "flex",
                          width: "max-content",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleOrderClick(order.Order_no)}
                      >
                        <TableCell style={{ textAlign: "center" }}>
                          <div
                            style={{
                              border:
                                paymentStatusLabel === "ไม่ระบุ"
                                  ? "transparent"
                                  : "1px solid #ccc",
                              padding: "8px",
                              borderRadius: "18px",
                              textAlign: "center",
                              display: "inline-block",
                              width: "65px",
                              backgroundColor:
                                paymentStatusLabel === "ไม่ระบุ"
                                  ? "transparent"
                                  : paymentStatusBgColor,
                              color: "#fff",
                            }}
                          >
                            {paymentStatusLabel === "ไม่ระบุ"
                              ? ``
                              : paymentStatusLabel}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "140px",
                            maxWidth: "140px",
                          }}
                        >
                          {handletime(order.Payment_Date7)}
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "91px",
                          }}
                        >
                          {order.Pay_By_Name}
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "60px",
                          }}
                        >
                          {formatNumberWithCommas(order.Total_Pay)}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
                          {formatNumberWithCommas(order.Total_Balance)}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "100px" }}
                        >
                          {order.Pay_By_BankName}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
                          {order.Charge_Id}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
                          {order.Ref_Number1}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <div
        style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}
      ></div>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div>
            <OrderDetailContent
              orderD={orderDetail}
              hispay={orderHispayDetail}
            />
          </div>
        </Box>
      </Modal>

      <WalkinModal
        open={walkinModalOpen}
        onClose={() => setWalkinModalOpen(false)}
        handlePayCash={handlePayCash}
        handlePayQRCODE={handlePayQRCODE}
        eventName={filters?.eventName}
      />
      <MoveTableDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        orderDetail={orderDetail}
        newMove={newMove}
        setNewMove={setNewMove}
        isSingleOrder={isSingleOrder}
        isSingleTable={isSingleTable}
      />
      {/* <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          เพิ่มการย้ายโต๊ะ
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            X
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              width: "100%",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              name="Order_ID"
              label="รหัสออเดอร์"
              type="text"
              fullWidth
              value={newMove.Order_ID}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none", // Remove the inner border
                    transform: "translateY(5px)",
                    color: "black", // <-- สีดำที่ต้องการ
                    WebkitTextFillColor: "black",
                  },
                },
              }}
              disabled
            />
            <TextField
              margin="dense"
              name="Cust_Name"
              label="ชื่อลูกค้า"
              type="text"
              fullWidth
              value={newMove.Cust_Name}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none", // Remove the inner border
                    transform: "translateY(5px)",
                    color: "black", // <-- สีดำที่ต้องการ
                    WebkitTextFillColor: "black",
                  },
                },
                marginLeft: "5px",
              }}
              disabled
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              width: "100%",
            }}
          >
            {orderDetail.length > 1 ? (
              <FormControl fullWidth margin="dense" sx={{ width: "275px" }}>
                <InputLabel>จากโซน</InputLabel>
                <Select
                  name="From_Zone"
                  value={newMove.From_Zone}
                  onChange={handleChangeNewMove}
                  label="จากโซน"
                >
                  {[...new Set(orderDetail.map((item) => item.Plan_Name))].map(
                    (zone, index) => (
                      <MenuItem key={index} value={zone}>
                        {zone}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            ) : (
              <TextField
                margin="dense"
                name="From_Zone"
                label="จากโซน"
                type="text"
                fullWidth
                value={newMove.From_Zone}
                onChange={handleChangeNewMove}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                      color: "black", // <-- สีดำที่ต้องการ
                      WebkitTextFillColor: "black",
                    },
                  },
                }}
                disabled
              />
            )}

            {orderDetail.length > 1 ? (
              <FormControl
                fullWidth
                margin="dense"
                disabled={!newMove.From_Zone}
                sx={{ width: "275px" }}
              >
                <InputLabel>จากโต๊ะ</InputLabel>
                <Select
                  name="From_Table"
                  value={newMove.From_Table}
                  onChange={handleChangeNewMove}
                  label="จากโต๊ะ"
                >
                  {[
                    ...new Set(
                      orderDetail
                        .filter((item) => item.Plan_Name === newMove.From_Zone)
                        .flatMap((item) =>
                          item.TicketNo_List.split(",").map((no) => no.trim())
                        )
                    ),
                  ].map((ticket, index) => (
                    <MenuItem key={index} value={ticket}>
                      {ticket.startsWith("A") ? "Walk-in" : ticket}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                {isSingleOrder && !isSingleTable ? (
                  <Select
                    name="From_Table"
                    value={newMove.From_Table}
                    onChange={handleChangeNewMove}
                    fullWidth
                    displayEmpty
                    sx={{
                      marginTop: "8px",
                      "& .MuiSelect-select": {
                        transform: "translateY(5px)",
                      },
                      marginLeft: "5px",
                      height: "51px",
                    }}
                  >
                    <MenuItem value="" disabled>
                      เลือกโต๊ะ
                    </MenuItem>
                    {[
                      ...new Set(
                        orderDetail
                          .filter(
                            (item) => item.Plan_Name === newMove.From_Zone
                          )
                          .flatMap((item) =>
                            item.TicketNo_List.split(",").map((no) => no.trim())
                          )
                      ),
                    ].map((ticket, index) => (
                      <MenuItem key={index} value={ticket}>
                        {ticket.startsWith("A") ? "Walk-in" : ticket}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <TextField
                    margin="dense"
                    name="From_Table"
                    label="จากโต๊ะ"
                    type="text"
                    fullWidth
                    value={newMove.From_Table}
                    onChange={handleChangeNewMove}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& input": {
                          border: "none",
                          transform: "translateY(5px)",
                        },
                      },
                      marginLeft: "5px",
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              width: "100%",
            }}
          >
            <TextField
              margin="dense"
              name="To_Zone"
              label="ไปโซน"
              type="text"
              fullWidth
              value={newMove.To_Zone}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              name="To_Table"
              label="ไปโต๊ะ"
              type="text"
              fullWidth
              value={newMove.To_Table}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none", // Remove the inner border
                    transform: "translateY(5px)",
                  },
                },
                marginLeft: "5px",
              }}
            />
          </div>

          <TextField
            margin="dense"
            name="Move_Remark"
            label="หมายเหตุ"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={newMove.Move_Remark}
            onChange={handleChangeNewMove}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmitMove}
            color="primary"
            variant="contained"
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default AllOrderContent;
