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

const OrderItems: React.FC<OrderItemsProps> = ({ order_id }) => {
  const [groupedTickets, setGroupedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTicketList() {
      try {
        const response = await getViewTicketListbyOrderid(order_id);
        console.log("tickets response:", response);

        if (Array.isArray(response.ticketList)) {
          // Filter tickets that match the order_id
          const matchingTickets = response.ticketList.filter(
            (ticket: Ticket) => String(ticket.order_id) === String(order_id)
          );

          // Get unique tickets by ticket_no
          const uniqueTickets = matchingTickets.filter(
            (ticket, index, self) =>
              index === self.findIndex((t) => t.ticket_no === ticket.ticket_no)
          );

          setGroupedTickets(uniqueTickets);
          console.log("Unique tickets by ticket_no:", uniqueTickets);
        } else {
          console.error(
            "Expected ticketList to be an array, but got:",
            typeof response.ticketList
          );
        }
      } catch (error) {
        console.error("Failed to fetch ticket list:", error);
      }
    }

    fetchTicketList();
  }, [order_id]);

  if (groupedTickets.length === 0) {
    return <p>No order details available</p>;
  }

  const totalPrice = groupedTickets.reduce(
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
        {/* <span style={{ color: "#28a745" }}> */}
        {/* {new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
          }).format(totalPrice)} */}
        {/* {groupedTickets.at(0)?.OrderStatus_Name} */}
        {/* </span> */}
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
          {groupedTickets.map((ticket, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {ticket.Plan_Name} [{ticket.ticket_no}]
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(ticket.Plan_Price)}
              </TableCell>
              <TableCell>
               {ticket.Total_stc}
              </TableCell>
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
