import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getPaymentHistoriesByOrderId } from "../../../services/his-payment.service";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

interface PaymentHistoryProps {
  dtOrderId: string; // Pass the DT_order_id to filter the tickets
}

interface PaymentHistory {
  His_Payment_id: number;
  Order_id: number;
  Net_Price: number;
  Total_Pay: number;
  Total_Balance: number;
  Pay_By_Name: string;
  Order_datetime: string;
}

const PaymentHistory: React.FC<{ dtOrderId: any }> = ({ dtOrderId }) => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("buyer::::", dtOrderId);

  // useEffect(() => {
  //   async function fetchPayments() {
  //     try {
  //       const paymentHistories = await getPaymentHistoriesByOrderId(dtOrderId);
  //       console.log("Fetched payments response:", paymentHistories);

  //       if (
  //         paymentHistories &&
  //         Array.isArray(paymentHistories) &&
  //         paymentHistories.length > 0
  //       ) {
  //         const sortedPayments = paymentHistories.sort((a, b) => {
  //           const dateA = new Date(a.Payment_Date7);
  //           const dateB = new Date(b.Payment_Date7);
  //           return dateA - dateB; // หากต้องการเรียงจากเก่าไปใหม่
  //           // return dateB - dateA; // หากต้องการเรียงจากใหม่ไปเก่า
  //         });
  //         setPayments(sortedPayments);
  //       } else {
  //         setError("No payment history found.");
  //       }
  //     } catch (error: any) {
  //       setError("Failed to load payment history.");
  //       console.error("Error fetching payment histories:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchPayments();
  // }, [buyer]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  // const totalPayment = payments.reduce(
  //   (total, payment) => total + payment.Total_Pay,
  //   0
  // );
  // const formattedTotalPayment = new Intl.NumberFormat("th-TH", {
  //   style: "currency",
  //   currency: "THB",
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // }).format(totalPayment);

  const handletime = (x) => {
    const adjustedDate = dayjs(x).subtract(7, "hour");
    const formattedDateTime = adjustedDate.format("DD/MM/BBBB - HH:mm น.");
    return formattedDateTime;
  };

  // switch (payments.Order_Status) {
  //   case 1:
  //     if (orderDetail.Total_Balance === 0) {
  //       statusLabel = "สำเร็จ";
  //       bgColor = "#28a745";
  //     } else {
  //       statusLabel = "ค้างจ่าย";
  //       bgColor = "#ffc107";
  //     }
  //     break;
  //   case 2:
  //     statusLabel = "มีแก้ไข";
  //     bgColor = "#17a2b8";
  //     break;
  //   case 13:
  //     statusLabel = "ขอคืนเงิน";
  //     bgColor = "#dc3545";
  //     break;
  //   case 3:
  //     statusLabel = "ไม่สำเร็จเพราะติด R";
  //     bgColor = "#343a40";
  //     break;
  //   case 4:
  //     statusLabel = "ไม่สำเร็จจาก Omise";
  //     bgColor = "#6c757d";
  //     break;
  //   default:
  //     statusLabel = "ไม่ระบุ";
  //     bgColor = "#f8f9fa";
  //     break;
  // }

  return (
    <TableContainer sx={{ width: "max-content" }}>
      <h2
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>ประวัติการชำระ</span>
        <span></span>
        {/* <span>{formattedTotalPayment}</span> */}
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              วันที่และเวลาชำระ
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              สัดส่วนการชำระ
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              จำนวนเงิน
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              ยอดสุทธิ
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              ยอดคงเหลือ
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              วิธีการชำระ
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                color: "#000",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Charge_Id
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                color: "#000",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Ref_Number1
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                color: "#000",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              ธนาคาร
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dtOrderId.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                ไม่มีข้อมูลการชำระเงิน
              </TableCell>
            </TableRow>
          ) : (
            dtOrderId?.map((payment) => {

              return (
                <TableRow key={payment.His_Payment_id}>
                  <TableCell>{handletime(payment.Payment_Date7)}</TableCell>
                  <TableCell style={{ paddingLeft: "115px" }}>
                    {payment.Pay_Opt_Name} %
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(payment.Total_Pay)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(payment.Net_Price)}
                  </TableCell>
                  <TableCell
                    style={{ color: "red" }}
                    sx={{ textAlign: "center" }}
                  >
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(payment.Total_Balance)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        border: "1px solid black",
                        padding: "8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "bold",
                        backgroundColor: "lightgrey",
                      }}
                    >
                      {payment.Pay_By_Name}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {payment.Charge_Id}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {payment.Ref_Number1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {payment.Pay_By_BankName}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentHistory;
