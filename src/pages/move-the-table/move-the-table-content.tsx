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
        console.log("Table Move History:", result);
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
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("event");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          sortBy: "publish-date",
          publishStatus: "all",
          status: "all",
          search: "",
          startDate: null as string | null,
          endDate: null as string | null,
          dateFilterType: "publish-date",
        };
  });

  const filteredList = tableMoveList.filter((item) =>
    item.Event_Name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    // localStorage.setItem("event", JSON.stringify(updatedFilters));
  };
  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Header title="ประวัติการย้ายโต๊ะ" />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-strat",
          margin: "20px",
        }}
      >
        <TextField
          name="search"
          value={filters.search}
          onChange={handleTextFieldChange}
          variant="outlined"
          label="ค้นจากชื่องาน"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& input": {
                border: "none",
                transform: "translateY(5px)",
                backgroundColor: "white",
              },
            },
          }}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px", borderRadius: "0", width: "80%" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              {[
                "ลำดับ",
                "ชื่อลงาน",
                "รหัสออเดอร์",
                "ชื่อลูกค้า",
                "จากโต๊ะ",
                "จากโซน",
                "ไปโต๊ะ",
                "ไปโซน",
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
            {filteredList.length > 0 ? (
              filteredList.map((row, index) => (
                <TableRow key={row.Move_ID}>
                  <TableCell align="center">
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell align="center">{row.Event_Name}</TableCell>
                  <TableCell align="center">{row.Order_no}</TableCell>
                  <TableCell align="center">{row.Cust_Name}</TableCell>
                  <TableCell align="center">{row.From_Table}</TableCell>
                  <TableCell align="center">{row.From_Zone}</TableCell>
                  <TableCell align="center">{row.To_Table}</TableCell>
                  <TableCell align="center">{row.To_Zone}</TableCell>
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
