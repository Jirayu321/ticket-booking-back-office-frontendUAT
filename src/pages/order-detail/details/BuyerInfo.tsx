import React from 'react';
import { Typography, Stack } from '@mui/material';

interface BuyerInfoProps {
  buyer: {
    Cust_name: string;
    Cust_tel: string;
    Line_id: string;
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