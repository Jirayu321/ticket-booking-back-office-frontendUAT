import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  getViewTicketList,
  getViewTicketListbyOrderid,
} from "../../../services/view-tikcet-list.service";

interface OrderItemsProps {
  order_id: string;
}

interface Ticket {
  DT_order_id: string;
  ticket_name: string;
  Total_Price: number;
  ticket_no: string;
  ticket_running: string;
}

interface OrderItemsProps {
  order_id: string;
  buyer: any; // Adjust the type based on your data structure
}

const OrderItems: React.FC<{ buyer: any }> = ({ buyer }) => {
  console.log("OrderItems buyer", buyer[0]?.Order_id);
  const [groupedTickets, setGroupedTickets] = useState<Ticket[]>([]);

  const totalPrice = groupedTickets?.reduce(
    (total, ticket) => total + ticket.Plan_Price,
    0
  );

  console.log("groupedTickets", groupedTickets);

  return (
    <TableContainer>
      <h2
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>รายละเอียดคำสั่งซื้อ</span>
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              ลำดับ
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              ชื่อบัตร
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              ราคาบัตร
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              จำนวนที่นั่ง
            </TableCell>
            <TableCell
              style={{ fontWeight: "bold", color: "#000", fontSize: "18px" }}
            >
              สถานะคำสั่งซื้อ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buyer.map((ticket, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {ticket.Plan_Name} [{ticket.TicketNo_List}]
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(ticket.Plan_Price)}
              </TableCell>
              <TableCell>{ticket.Total_stc}</TableCell>
              <TableCell
                style={{
                  color:
                    ticket?.OrderStatus_Name === "สำเร็จ"
                      ? "green"
                      : ticket?.OrderStatus_Name === "รอดำเนินการ"
                      ? "orange"
                      : ticket?.OrderStatus_Name === "จ่ายไม่สำเร็จ"
                      ? "red"
                      : "black",
                  fontWeight: "bold",
                }}
              >
                {ticket.OrderStatus_Name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderItems;
