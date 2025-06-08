import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, TextField, Modal, Grid } from "@mui/material";
import Swal from "sweetalert2";
import { authAxiosClient } from "../../config/axios.config";
import { FaPrint } from "react-icons/fa";
import io from "socket.io-client";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  color: "black",
};

interface WalkinModalProps {
  open: boolean;
  onClose: () => void;
  handlePayCash: (orderId: number, amount: number) => void;
  handlePayQRCODE: (orderId: number, amount: number) => void;
  eventName: string;
}

const WalkinModal: React.FC<WalkinModalProps> = ({
  open,
  onClose,
  handlePayCash,
  handlePayQRCODE,
  eventName,
}) => {
  const [walkinQty, setWalkinQty] = useState(1);
  const [walkinPrice, setWalkinPrice] = useState(10);
  const total = walkinQty * walkinPrice;
  const socketRef = useRef<any>(null);

  if (!socketRef.current) {
    socketRef.current = io(
      "https://deedclub-staff-backend-uat2.appsystemyou.com",
      {
        path: "/socket_io",
      }
    );
  }
  const handleConfirm = async (method: "cash" | "qr") => {
    try {
      const response = await authAxiosClient.post("/api/create-walkin-order", {
        qty: walkinQty,
        price: walkinPrice,
        paymentMethod: method,
        eventName: `'${eventName}'`,
      });

      const { orderId } = response.data;
      console.log("response.data", response.data);
      if (method === "cash") {
        handlePayCash(orderId, total);
      } else {
        handlePayQRCODE(orderId, total);
      }

      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถดำเนินการได้",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* 🔺 ปุ่มกากบาทมุมขวาบน */}
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: "unset",
            padding: "4px 8px",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "black",
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          ✕
        </Button>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ justifySelf: "center", marginBottom: "2rem" }}
        >
          ซื้อบัตรหน้างาน
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid item xs={6}>
            <TextField
              label="ราคาต่อใบ"
              type="number"
              fullWidth
              value={walkinPrice}
              onChange={(e) => setWalkinPrice(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              sx={{ width: "150px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <Button
                onClick={() => setWalkinQty(Math.max(1, walkinQty - 1))}
                sx={{
                  backgroundColor: "#CFB70B",
                  color: "black",
                  minWidth: "40px",
                  "&:hover": {
                    backgroundColor: "#b89e09",
                  },
                }}
              >
                -
              </Button>
              <Typography mx={2}>{walkinQty}</Typography>
              <Button
                onClick={() => setWalkinQty(walkinQty + 1)}
                sx={{
                  backgroundColor: "#CFB70B",
                  color: "black",
                  minWidth: "40px",
                  "&:hover": {
                    backgroundColor: "#b89e09",
                  },
                }}
              >
                +
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ justifySelf: "center", marginBottom: "2rem " }}
            >
              ยอดรวม: {total.toLocaleString()} บาท
            </Typography>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              onClick={() => handleConfirm("cash")}
              sx={{
                backgroundColor: "#CFB70B",
                color: "black",
                width: "150px",
              }}
            >
              ชำระเงินสด
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConfirm("qr")}
              sx={{
                backgroundColor: "#CFB70B",
                color: "black",
                width: "150px",
              }}
            >
              ชำระ QR CODE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default WalkinModal;
