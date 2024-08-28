import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getViewTicketList } from '../../../services/view-tikcet-list.service';

interface PaymentHistoryProps {
  dtOrderId: string; // Pass the DT_order_id to filter the tickets
}

interface Ticket {
  date: string;
  amount: number;
  method: string;
  dt_order_id: string; // Add other necessary fields based on your data structure
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ dtOrderId }) => {
  const [payments, setPayments] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await getViewTicketList();
        
        // Log the entire response to inspect its structure
        console.log('API Response:', response);

        // Assuming the correct data is inside a 'data' property (adjust as needed)
        const tickets = response.data || response; // Adjust according to the actual structure

        if (Array.isArray(tickets)) {
          const filteredPayments = tickets.filter((ticket: Ticket) => ticket.dt_order_id === dtOrderId);
          setPayments(filteredPayments);
        } else {
          console.error('Expected an array, but received:', typeof tickets);
        }
      } catch (error) {
        console.error('Failed to fetch ticket list:', error);
      }
    }

    fetchPayments();
  }, [dtOrderId]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>วันที่ชำระ</TableCell>
            <TableCell align="right">จำนวนเงิน</TableCell>
            <TableCell align="right">วิธีการชำระ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{payment.date}</TableCell>
              {/* <TableCell align="right">
                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(payment.amount)}
              </TableCell>
              <TableCell align="right">{payment.method}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentHistory;
