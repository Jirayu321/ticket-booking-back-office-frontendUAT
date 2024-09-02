import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getPaymentHistoriesByOrderId } from '../../../services/his-payment.service';

interface PaymentHistoryProps {
  dtOrderId: string; // Pass the DT_order_id to filter the tickets
}

interface PaymentHistory {
  date: string;
  amount: number;
  method: string;
  dt_order_id: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ dtOrderId }) => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const paymentHistories = await getPaymentHistoriesByOrderId(dtOrderId);
        setPayments(paymentHistories);
      } catch (error: any) {
        setError("Failed to load payment history.");
        console.error('Error fetching payment histories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [dtOrderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
              <TableCell align="right">
                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(payment.amount)}
              </TableCell>
              <TableCell align="right">{payment.method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentHistory;
