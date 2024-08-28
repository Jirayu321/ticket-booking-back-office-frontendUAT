import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getViewTicketList } from '../../../services/view-tikcet-list.service'; // Update the path as needed

interface OrderItemsProps {
  items: {
    DT_order_id: string;
    Total_Price: number;
    ticket_no: string;
  }[];
}



const OrderItems: React.FC<OrderItemsProps> = ({ items = [] }) => {
  const [ticketList, setTicketList] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTicketList() {
      try {
        const tickets = await getViewTicketList();
        if (Array.isArray(tickets)) {
          setTicketList(tickets);
        } else {
          console.error("Expected tickets to be an array, but got:", typeof tickets);
        }
      } catch (error) {
        console.error("Failed to fetch ticket list:", error);
      }
    }

    fetchTicketList();
  }, []);


  if (items.length === 0) {
    return <p>No order details available</p>;
  }

const totalPrice = items.reduce((total, item) => total + item.Total_Price, 0);

return (
    <TableContainer>
            <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>คำสั่งซื้อ:</span>
                <span>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(totalPrice)}</span>
            </h2>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>ลำดับ</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>รหัสบัตร (DT_order_id)</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>ชื่อบัตร</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px', textAlign: 'right' }}>ราคาบัตร</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.DT_order_id}</TableCell>
                        <TableCell>{item.ticket_no}</TableCell>
                        <TableCell align="right">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(item.Total_Price)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
};

export default OrderItems;
