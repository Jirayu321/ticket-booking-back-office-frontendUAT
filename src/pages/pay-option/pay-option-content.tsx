import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  createPayOption,
  deletePayOption,
  getPayOption,
  updatePayOption,
} from "../../services/pay-option.service";
import { getHispayment } from "../../services/his-payment.service";
import Header from "../common/header";
import Swal from "sweetalert2";

const PayOptionContent: React.FC = () => {
  const [payOptions, setPayOptions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newPayOption, setNewPayOption] = useState({
    name: "",
    desc: "",
  });
  const [editPayOption, setEditPayOption] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPayOptions = async () => {
    try {
      const data = await getPayOption();
      if (data && data.payOptions) {
        setPayOptions(data.payOptions);
      } else {
        setPayOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch pay options:", error);
    }
  };

  useEffect(() => {
    fetchPayOptions();
  }, []);

  const handleOpen = () => {
    setNewPayOption({ name: "", desc: "" }); // Reset fields when opening the create dialog
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (payOption: any) => {
    setEditPayOption(payOption);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPayOption(null);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    setNewPayOption({
      ...newPayOption,
      [event.target.name as string]: event.target.value,
    });
  };

  const handleEditChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    setEditPayOption({
      ...editPayOption,
      [event.target.name as string]: event.target.value,
    });
  };

  const isDuplicatePayOptionName = (
    name: string,
    existingOptions: any[],
    currentId?: number
  ): boolean => {
    return existingOptions.some(
      (option) =>
        option.Pay_Opt_Name.trim().toLowerCase() ===
          name.trim().toLowerCase() && option.Pay_Opt_Id !== currentId
    );
  };

  const handleCreate = async () => {
    try {
      // Fetch the latest payment options to ensure accurate duplicate check
      const latestPayOptions = await getPayOption();
      if (
        isDuplicatePayOptionName(newPayOption.name, latestPayOptions.payOptions)
      ) {
        window.alert("มีตัวเลือกการจ่ายเงินที่มีชื่อเดียวกันแล้ว");
        return;
      }

      await createPayOption({
        Pay_Opt_Name: newPayOption.name,
        Pay_Opt_Desc: newPayOption.desc,
        Pay_Opt_Active: "Y", // Default to inactive; user can toggle after creation
        Created_By: "Admin", // Replace with actual creator
      });
      setOpen(false);
      fetchPayOptions(); // Refresh the list after creation
      Swal.fire({
        icon: "success",
        title: "สร้างตัวเลือกการจ่ายเงินสำเร็จ",
      });
    } catch (error) {
      console.error("Failed to create pay option:", error);
      window.alert("ล้มเหลวระหว่างสร้างตัวเลือกการจ่ายเงิน");
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Fetch the latest payment options to ensure accurate duplicate check
      const latestPayOptions = await getPayOption();
      if (
        isDuplicatePayOptionName(
          editPayOption.Pay_Opt_Name,
          latestPayOptions.payOptions,
          editPayOption.Pay_Opt_Id
        )
      ) {
        window.alert("มีตัวเลือกการจ่ายเงินที่มีชื่อเดียวกันแล้ว");
        return;
      }

      await updatePayOption({
        Pay_Opt_Id: editPayOption.Pay_Opt_Id,
        Pay_Opt_Name: editPayOption.Pay_Opt_Name,
        Pay_Opt_Desc: editPayOption.Pay_Opt_Desc,
        Pay_Opt_Active: editPayOption.Pay_Opt_Active,
      });
      Swal.fire({
        icon: "success",
        title: "อัปเดตตัวเลือกการจ่ายเงินสำเร็จ",
      });
      handleEditClose();
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      console.error("Failed to update pay option:", error);
      window.alert("ล้มเหลวระหว่างอัปเดตตัวเลือกการจ่ายเงิน");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Fetch the payment history data to check if the Pay_Opt_Id is being used
      const paymentHistory = await getHispayment();

      // Check if the Pay_Opt_Id is used in any payment history record
      const isUsedInPaymentHistory = paymentHistory.some(
        (history) => history.Pay_Opt_Id === id
      );

      if (isUsedInPaymentHistory) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบตัวเลือกการจ่ายเงินที่ใช้งานอยู่",
        });
        return;
      }

      // Proceed with deletion if not used
      await deletePayOption(id);
      Swal.fire({
        icon: "success",
        title: "ลบตัวเลือกการจ่ายเงินสำเร็จ",
      });
      fetchPayOptions(); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete pay option:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวระหว่างลบตัวเลือกการจ่ายเงิน",
      });
    }
  };

  const toggleActiveStatus = async (payOption: any) => {
    try {
      await updatePayOption({
        Pay_Opt_Id: payOption.Pay_Opt_Id,
        Pay_Opt_Name: payOption.Pay_Opt_Name,
        Pay_Opt_Desc: payOption.Pay_Opt_Desc,
        Pay_Opt_Active: payOption.Pay_Opt_Active === "Y" ? "N" : "Y",
      });
      Swal.fire({
        icon: "success",
        title: "ลบวิธีการจ่ายเงินสำเร็จ",
      });
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      console.error("Failed to update active status:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวระหว่างอัปเดตสถานะการใช้งาน",
      });
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
  const currentItems = payOptions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
      }}
    >
      <Header title="ตัวเลือกการจ่ายเงิน" />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "25px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "#0B8600",
            color: "white",
            marginLeft: "auto%",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          + เพิ่มรายการ
        </Button>
      </div>
      <TableContainer component={Paper} sx={{ borderRadius: "0" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              <TableCell
                style={{
                  textAlign: "center",
                  width: "60px",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                ลำดับ
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  width: "100px",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                ชื่อ
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  width: "300px",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                คำอธิบาย
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  width: "150px",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                สถานะ
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  width: "300px",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                จัดการ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((payOption, index) => (
                <TableRow key={payOption.Pay_Opt_Id}>
                  <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {payOption.Pay_Opt_Name_Int}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {payOption.Pay_Opt_Desc || "-"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Switch
                      checked={payOption.Pay_Opt_Active === "Y"}
                      onChange={() => toggleActiveStatus(payOption)}
                      inputProps={{ "aria-label": "controlled" }}
                      color="primary"
                    />
                    <span>
                      {payOption.Pay_Opt_Active === "Y"
                        ? "เผยแพร่"
                        : "ไม่เผยแพร่"}
                    </span>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(payOption)}
                      sx={{ marginRight: "5px" }}
                    >
                      รายละเอียด
                    </Button>
                    <IconButton
                      onClick={() => handleDelete(payOption.Pay_Opt_Id)}
                      style={{
                        color: "gray",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  No pay options available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={Math.ceil(payOptions.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Pay Option</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Pay Option Name"
            type="text"
            fullWidth
            value={newPayOption.name}
            onChange={handleChange}
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
            name="desc"
            label="Description"
            type="text"
            fullWidth
            value={newPayOption.desc}
            onChange={handleChange}
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
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {editPayOption && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขตัวเลือกการจ่ายเงิน</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="Pay_Opt_Name"
              label="Pay Option Name"
              type="text"
              fullWidth
              value={editPayOption.Pay_Opt_Name}
              onChange={handleEditChange}
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
              name="Pay_Opt_Desc"
              label="Description"
              type="text"
              fullWidth
              value={editPayOption.Pay_Opt_Desc}
              onChange={handleEditChange}
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
            <Button onClick={handleEditClose} color="primary">
            ปิด
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
            บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PayOptionContent;
