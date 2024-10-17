import React from "react";
import { Typography, Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th"; // Import Thai locale

dayjs.extend(buddhistEra);
dayjs.locale("th"); // Set locale globally to Thai

const BuyerInfo: React.FC<{ buyer: any }> = ({ buyer }) => {
  console.log("buyer", buyer);

  const adjustedDate = dayjs(buyer.Order_datetime)
    .subtract(7, "hour")
    .format("D MMMM BBBB HH:mm");

  return (
    <Stack
      spacing={3}
      sx={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Box
        display="grid"
        justifyContent="space-between"
        gridTemplateColumns={"auto auto auto auto"}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          <strong>เลขคำสั่งซื้อ:</strong> {buyer.Order_no}
        </Typography>
        <Typography variant="body1">
          <strong>ชื่องาน:</strong> {buyer.Event_Name}
        </Typography>
        <Typography></Typography>
        <Typography></Typography>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          <strong>วันที่สั่งซื้อ:</strong> {adjustedDate} น.
        </Typography>
        <Typography>
          <strong>ชื่อ:</strong> {buyer.Cust_name}
        </Typography>
        <Typography>
          <strong>เบอร์โทร:</strong> {buyer.Cust_tel}
        </Typography>
        <Typography variant="body1">
          <strong>LINE ID:</strong>{" "}
          {buyer.Line_id ? `${buyer.Line_id}` : ``}
        </Typography>
      </Box>
    </Stack>
  );
};

export default BuyerInfo;
