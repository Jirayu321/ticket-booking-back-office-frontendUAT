import React from 'react';
import { Typography, Stack, Box } from '@mui/material';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th'; // Import Thai locale

dayjs.extend(buddhistEra);
dayjs.locale('th'); // Set locale globally to Thai

interface BuyerInfoProps {
  buyer: {
    Cust_name: string;
    Cust_tel: string;
    Line_id: string;
    Order_no: string;
    Order_datetime: string;
  };
}

const BuyerInfo: React.FC<BuyerInfoProps> = ({ buyer }) => {
  // Subtract 7 hours and format with Buddhist Era
  const adjustedDate = dayjs(buyer.Order_datetime)
    .subtract(7, 'hour')
    .format('D MMMM BBBB HH:mm');

  return (
    <Stack
      spacing={2}
      sx={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" sx={{ paddingLeft: "500px", fontWeight: "bold" }}>
          <strong>เลขคำสั่งซื้อ:</strong> {buyer.Order_no}
        </Typography>
        <Typography variant="body1" sx={{ paddingRight: "500px", fontWeight: "bold" }}>
          <strong>วันที่สั่งซื้อ:</strong> {adjustedDate}
        </Typography>
      </Box>

      <Typography variant="body1">
        <strong>ชื่อ:</strong> {buyer.Cust_name}
      </Typography>
      <Typography variant="body1">
        <strong>เบอร์โทร:</strong> {buyer.Cust_tel}
      </Typography>
      <Typography variant="body1">
        <strong>LINE ID:</strong> {buyer.Line_id}
      </Typography>
    </Stack>
  );
};

export default BuyerInfo;