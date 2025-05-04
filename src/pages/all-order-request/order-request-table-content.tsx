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
import Header from "../common/header.tsx";
import { getOrderRequestList } from "../../services/order-request.service";
import { authAxiosClient } from "../../config/axios.config.ts";

const TableOrderRequestHistoryContent: React.FC = () => {
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

  function getStatusText(status: number): string {
    switch (status) {
      case 1:
        return "รอดำเนินการ";
      case 2:
        return "อนุมัติแล้ว";
      case 3:
        return "ยกเลิก";
      default:
        return "ไม่ทราบสถานะ";
    }
  }
  

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
    fetchOrderRequestList();
  }, []);

  const fetchOrderRequestList = async () => {
    try {
      const result = await getOrderRequestList(); // เช่น เรียก endpoint `/api/order-request`
      if (Array.isArray(result)) {
        setTableMoveList(result);
      } else {
        setTableMoveList([]);
      }
    } catch (error) {
      console.error("Failed to fetch order request list:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableMoveList.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Header title="คำสั่งซื้อที่มีปัญหา" />

      {/* <div
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
      </div> */}

      <TableContainer
        component={Paper}
        sx={{ margin: "20px", borderRadius: "0", width: "80%" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              {[
                "ลำดับ",
                "เลขคำขอ",
                "วันที่",
                "สถานะ",
                "อีเวนต์",
                "ชื่อลูกค้า",
                "เบอร์โทร",
                "สร้างโดย",
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
                <TableRow key={row.OR_id}>
                  <TableCell align="center">
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell align="center">{row.OR_No}</TableCell>
                  <TableCell align="center">
                    {formatDateTime(row.OR_Datetime)}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusText(row.OR_Status)}
                  </TableCell>
                  <TableCell align="center">{row.Event_Name}</TableCell>
                  <TableCell align="center">{row.Cust_name}</TableCell>
                  <TableCell align="center">{row.Cust_tel}</TableCell>
                  <TableCell align="center">{row.Created_By}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  ไม่พบข้อมูลคำขอ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

  
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

export default TableOrderRequestHistoryContent;
