import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getPaymentHistoriesByOrderId } from '../../../services/his-payment.service';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

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

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ dtOrderId }) => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const paymentHistories = await getPaymentHistoriesByOrderId(dtOrderId);
        console.log('Fetched payments response:', paymentHistories);

        if (paymentHistories && Array.isArray(paymentHistories) && paymentHistories.length > 0) {
          setPayments(paymentHistories);
        } else {
          setError("No payment history found.");
        }
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

  const totalPayment = payments.reduce((total, payment) => total + payment.Total_Pay, 0);
  const formattedTotalPayment = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalPayment);

  return (
    <TableContainer>
      <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>ประวัติการชำระ:</span>
        <span>{formattedTotalPayment}</span>
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>
              วันที่และเวลาชำระ
            </TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>
              สัดส่วนการชำระ
            </TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>
              จำนวนเงิน
            </TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>
              ยอดคงเหลือ
            </TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#000', fontSize: '18px' }}>
              วิธีการชำระ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">ไม่มีข้อมูลการชำระเงิน</TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => {
              const adjustedDate = dayjs(payment.Order_datetime).subtract(7, 'hour');
              const formattedDateTime = adjustedDate.format('DD/MM/BBBB HH:mm'); // Combined date and time

              return (
                <TableRow key={payment.His_Payment_id}>
                  <TableCell>{formattedDateTime}</TableCell>
                  <TableCell style={{ paddingLeft: '115px' }}>{payment.Pay_Opt_Name}%</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(payment.Total_Pay)}
                  </TableCell>
                  <TableCell style={{ color: 'red' }}>
                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(payment.Total_Balance)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        border: '1px solid black',
                        padding: '8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        backgroundColor: 'lightgrey',
                      }}
                    >
                      {payment.Pay_By_Name}
                    </Box>
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
