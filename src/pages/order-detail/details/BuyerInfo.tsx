import React from 'react';
import { Typography, Stack, Box } from '@mui/material';

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
      {/* Row for Order Number and Order Date */}
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" sx={{paddingLeft:"500px",fontWeight:"bold"}}>
          <strong>เลขคำสั่งซื้อ:</strong> {buyer.Order_no}
        </Typography>
        <Typography variant="body1" sx={{paddingRight:"500px",fontWeight:"bold"}}>
          <strong>วันที่สั่งซื้อ:</strong> {new Date(buyer.Order_datetime).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </Typography>
      </Box>

      {/* Individual rows for other customer details */}
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
