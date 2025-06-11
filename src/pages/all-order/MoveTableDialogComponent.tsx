import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";
import { getViewEventStock, getAvailableTablesByPlan } from "../../lib/api";
import { authAxiosClient } from "../../config/axios.config";

export default function MoveTableDialogComponent({
  openDialog,
  handleCloseDialog,
  orderDetail,
  newMove,
  setNewMove,
  isSingleOrder,
  isSingleTable,
}) {
  const [zones, setZones] = useState<any[]>([]);
  const [availableTables, setAvailableTables] = useState<string[]>([]);

  const handleSubmitMove = async () => {
    const { Order_ID, Cust_Name, From_Table, To_Table, Moved_By, Move_Remark } =
      newMove;
    console.log(
      " Order_ID, Cust_Name, From_Table, To_Table, Moved_By, Move_Remark ",
      Order_ID,
      Cust_Name,
      From_Table,
      To_Table.Ticket_No,
      Moved_By,
      Move_Remark
    );
    if (!Order_ID || !Cust_Name || !From_Table || !To_Table) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await authAxiosClient.post("/api/table-move/full", {
        Order_ID,
        Cust_Name,
        From_Table,
        To_Table: To_Table.Ticket_No,
        Moved_By,
        Move_Remark,
      });

      const { status, message, needPayment, diffAmount, qrUrl } = response.data;

      if (status === "success") {
        if (needPayment && diffAmount > 0 && qrUrl) {
          const confirmPay = window.confirm(
            `คุณต้องชำระเพิ่ม ${diffAmount.toLocaleString()} บาท\nกด OK เพื่อดู QR Code ชำระเงิน`
          );
          if (confirmPay) {
            window.open(qrUrl, "_blank");
          }
        }

        // alert("ย้ายโต๊ะสำเร็จ");
        window.location.replace("/all-orders");
        handleCloseDialog();
        // fetchTableMoveHistory();
      } else {
        alert(message || "ไม่สามารถย้ายโต๊ะได้");
      }
    } catch (err) {
      console.error("❌ Failed to move table", err);
      alert("เกิดข้อผิดพลาดในการย้ายโต๊ะ");
    }
  };

  useEffect(() => {
    const fetchZones = async () => {
      const data = await getViewEventStock(orderDetail?.at(0).Event_Id);
      setZones(data);
    };
    if (openDialog) fetchZones();
  }, [openDialog]);

  useEffect(() => {
    console.log("newMove.To_Zone", newMove.To_Zone, zones.length);
    if (!newMove.To_Zone || !zones.length) return;

    const zone = zones.find((z) => z.Plan_Name === newMove.To_Zone);
    const eventID = orderDetail?.at(0)?.Event_Id;

    if (!zone || !eventID) return;

    const fetchAvailableTables = async () => {
      const tables = await getAvailableTablesByPlan(eventID, zone.Plan_Id);
      console.log("tables:", tables);
      setAvailableTables(tables);
      if (tables.length === 1) {
        setNewMove((prev) => ({ ...prev, To_Table: tables[0] }));
      }
    };

    fetchAvailableTables();
  }, [newMove.To_Zone]);

  const handleChangeNewMove = (e) => {
    const { name, value } = e.target;
    setNewMove((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (newMove.From_Zone && orderDetail.length > 1) {
      const tables = [
        ...new Set(
          orderDetail
            .filter((item) => item.Plan_Name === newMove.From_Zone)
            .flatMap((item) =>
              item.TicketNo_List.split(",").map((no) => no.trim())
            )
        ),
      ];
      if (tables.length === 1) {
        setNewMove((prev) => ({ ...prev, From_Table: tables[0] }));
      }
    }
  }, [newMove.From_Zone, orderDetail]);

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
      <DialogTitle>
        เพิ่มการย้ายโต๊ะ
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          X
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            width: "100%",
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            name="Order_ID"
            label="รหัสออเดอร์"
            type="text"
            fullWidth
            value={newMove.Order_ID}
            onChange={handleChangeNewMove}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none",
                  transform: "translateY(5px)",
                  color: "black",
                  WebkitTextFillColor: "black",
                },
              },
            }}
            disabled
          />
          <TextField
            margin="dense"
            name="Cust_Name"
            label="ชื่อลูกค้า"
            type="text"
            fullWidth
            value={newMove.Cust_Name}
            onChange={handleChangeNewMove}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none",
                  transform: "translateY(5px)",
                  color: "black",
                  WebkitTextFillColor: "black",
                },
              },
              marginLeft: "5px",
            }}
            disabled
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            width: "100%",
          }}
        >
          {orderDetail.length > 1 ? (
            <FormControl fullWidth margin="dense" sx={{ width: "275px" }}>
              <InputLabel>จากโซน</InputLabel>
              <Select
                name="From_Zone"
                value={newMove.From_Zone}
                onChange={handleChangeNewMove}
                label="จากโซน"
              >
                {[...new Set(orderDetail.map((item) => item.Plan_Name))].map(
                  (zone, index) => (
                    <MenuItem key={index} value={zone}>
                      {zone}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          ) : (
            <TextField
              margin="dense"
              name="From_Zone"
              label="จากโซน"
              type="text"
              fullWidth
              value={newMove.From_Zone}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    color: "black",
                    WebkitTextFillColor: "black",
                  },
                },
              }}
              disabled
            />
          )}

          {orderDetail.length > 1 ? (
            <FormControl
              fullWidth
              margin="dense"
              disabled={!newMove.From_Zone}
              sx={{ width: "275px" }}
            >
              <InputLabel>จากโต๊ะ</InputLabel>
              <Select
                name="From_Table"
                value={newMove.From_Table}
                onChange={handleChangeNewMove}
                label="จากโต๊ะ"
              >
                {[
                  ...new Set(
                    orderDetail
                      .filter((item) => item.Plan_Name === newMove.From_Zone)
                      .flatMap((item) =>
                        item.TicketNo_List.split(",").map((no) => no.trim())
                      )
                  ),
                ].map((ticket, index) => (
                  <MenuItem key={index} value={ticket}>
                    {ticket.startsWith("A") ? "Walk-in" : ticket}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : isSingleOrder && !isSingleTable ? (
            <Select
              name="From_Table"
              value={newMove.From_Table}
              onChange={handleChangeNewMove}
              fullWidth
              displayEmpty
              sx={{
                marginTop: "8px",
                marginLeft: "5px",
                height: "51px",
                "& .MuiSelect-select": { transform: "translateY(5px)" },
              }}
            >
              <MenuItem value="" disabled>
                เลือกโต๊ะ
              </MenuItem>
              {[
                ...new Set(
                  orderDetail
                    .filter((item) => item.Plan_Name === newMove.From_Zone)
                    .flatMap((item) =>
                      item.TicketNo_List.split(",").map((no) => no.trim())
                    )
                ),
              ].map((ticket, index) => (
                <MenuItem key={index} value={ticket}>
                  {ticket.startsWith("A") ? "Walk-in" : ticket}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              margin="dense"
              name="From_Table"
              label="จากโต๊ะ"
              type="text"
              fullWidth
              value={newMove.From_Table}
              onChange={handleChangeNewMove}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { border: "none", transform: "translateY(5px)" },
                },
                marginLeft: "5px",
              }}
            />
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            width: "100%",
          }}
        >
          <FormControl fullWidth margin="dense" sx={{ width: "275px" }}>
            <InputLabel>ไปโซน</InputLabel>
            <Select
              name="To_Zone"
              value={newMove.To_Zone}
              onChange={handleChangeNewMove}
              label="ไปโซน"
            >
              {zones.map((zone, index) => (
                <MenuItem key={index} value={zone.Plan_Name}>
                  {zone.Plan_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            margin="dense"
            sx={{ marginLeft: "5px", width: "275px" }}
          >
            <InputLabel>ไปโต๊ะ</InputLabel>
            <Select
              name="To_Table"
              value={newMove.To_Table}
              onChange={handleChangeNewMove}
              label="ไปโต๊ะ"
            >
              {availableTables.map((table, index) => (
                <MenuItem key={index} value={table}>
                  {table?.Ticket_No}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TextField
          margin="dense"
          name="Move_Remark"
          label="หมายเหตุ"
          type="text"
          fullWidth
          multiline
          minRows={3}
          value={newMove.Move_Remark}
          onChange={handleChangeNewMove}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& input": {
                border: "none",
                transform: "translateY(5px)",
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          ยกเลิก
        </Button>
        <Button onClick={handleSubmitMove} color="primary" variant="contained">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
