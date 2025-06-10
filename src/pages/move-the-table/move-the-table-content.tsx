import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../common/header";
import { getTableMoveHistory } from "../../services/table-move.service.ts";
import { authAxiosClient } from "../../config/axios.config.ts";

const TableMoveHistoryContent: React.FC = () => {
  const [tableMoveList, setTableMoveList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newMove, setNewMove] = useState({
    Order_ID: "",
    Cust_Name: "",
    From_Table: "",
    To_Table: "",
    Moved_By: "",
    Move_Remark: "",
  });

  const [openDialog, setOpenDialog] = useState(false);

  // โหลดข้อมูลพนักงานจาก localStorage
  useEffect(() => {
    const empData = localStorage.getItem("emmp");
    if (empData) {
      const parsedEmp = JSON.parse(empData);
      setNewMove((prev) => ({
        ...prev,
        Moved_By: parsedEmp.Emp_Name || "",
      }));
    }
  }, []);

  // โหลดข้อมูลประวัติการย้ายโต๊ะ
  useEffect(() => {
    fetchTableMoveHistory();
  }, []);

  const fetchTableMoveHistory = async () => {
    try {
      const result = await getTableMoveHistory();
      if (Array.isArray(result)) {
        setTableMoveList(result);
      } else {
        setTableMoveList([]);
      }
    } catch (error) {
      console.error("Failed to fetch table move history:", error);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableMoveList.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMove((prev) => ({
      Order_ID: "",
      Cust_Name: "",
      From_Table: "",
      To_Table: "",
      Moved_By: prev.Moved_By, // คงชื่อผู้ย้ายไว้
      Move_Remark: "",
    }));
  };

  function formatDateTime(datetime: string | Date) {
    const now = new Date(datetime);
    now.setHours(now.getHours() - 7); // เพิ่มเวลาไทย +7 ชั่วโมง
  
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
  
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  }

  const handleChangeNewMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMove({ ...newMove, [e.target.name]: e.target.value });
  };

  const handleSubmitMove = async () => {
    const { Order_ID, Cust_Name, From_Table, To_Table, Moved_By, Move_Remark } =
      newMove;

    if (!Order_ID || !Cust_Name || !From_Table || !To_Table) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await authAxiosClient.post(
        "/api/table-move/full",
        {
          Order_ID,
          Cust_Name,
          From_Table,
          To_Table,
          Moved_By,
          Move_Remark,
        }
      );

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

        alert("ย้ายโต๊ะสำเร็จ");
        handleCloseDialog();
        fetchTableMoveHistory();
      } else {
        alert(message || "ไม่สามารถย้ายโต๊ะได้");
      }
    } catch (err) {
      console.error("❌ Failed to move table", err);
      alert("เกิดข้อผิดพลาดในการย้ายโต๊ะ");
    }
  };

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Header title="ประวัติการย้ายโต๊ะ" />

      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenDialog}
          sx={{ fontWeight: "bold" }}
        >
          + เพิ่มรายการ
        </Button>
      </div>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px", borderRadius: "0",width:"80%" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              {[
                "ลำดับ",
                "รหัสออเดอร์",
                "ชื่อลูกค้า",
                "จากโต๊ะ",
                "ไปโต๊ะ",
                "โดย",
                "หมายเหตุ",
                "วันที่",
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <TableRow key={row.Move_ID}>
                  <TableCell align="center">
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell align="center">{row.Order_ID}</TableCell>
                  <TableCell align="center">{row.Cust_Name}</TableCell>
                  <TableCell align="center">{row.From_Table}</TableCell>
                  <TableCell align="center">{row.To_Table}</TableCell>
                  <TableCell align="center">{row.Moved_By}</TableCell>
                  <TableCell align="center">{row.Move_Remark || "-"}</TableCell>
                  <TableCell align="center">
                    {formatDateTime(row.Created_At)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  ไม่พบข้อมูลการย้ายโต๊ะ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>เพิ่มการย้ายโต๊ะ</DialogTitle>
        <DialogContent>
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
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
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
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
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
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            name="To_Table"
            label="ไปโต๊ะ"
            type="text"
            fullWidth
            value={newMove.To_Table}
            onChange={handleChangeNewMove}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
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
                  border: "none", // Remove the inner border
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
          <Button
            onClick={handleSubmitMove}
            color="primary"
            variant="contained"
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
      >
        {/* <Pagination
          count={Math.ceil(tableMoveList.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        /> */}
      </div>
    </div>
  );
};

export default TableMoveHistoryContent;
