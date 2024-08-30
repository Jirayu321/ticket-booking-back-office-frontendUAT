import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPayBy, createPayBy, updatePayBy, deletePayBy } from "../../services/pay-by.service";
import { getHispayment } from "../../services/his-payment.service";
import Header from "../common/header";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PayByContent: React.FC = () => {
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
      const data = await getPayBy();
      if (data && data.payByMethods) {
        setPayOptions(data.payByMethods);
      } else {
        setPayOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch pay options:", error);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถดึงข้อมูลวิธีการจ่ายเงินได้",
      });
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setNewPayOption({
      ...newPayOption,
      [event.target.name as string]: event.target.value,
    });
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setEditPayOption({
      ...editPayOption,
      [event.target.name as string]: event.target.value,
    });
  };

  const isDuplicatePayByName = (name: string, options: any[], currentId?: number): boolean => {
    return options.some(
      (option) =>
        option.Pay_By_Name.trim().toLowerCase() === name.trim().toLowerCase() &&
        option.Pay_By_Id !== currentId
    );
  };

  const handleCreate = async () => {
    // Ensure duplicate check before proceeding
    if (isDuplicatePayByName(newPayOption.name, payOptions)) {
      Swal.fire({
        icon: "error",
        title: "มีตัวเลือกการจ่ายเงินที่มีชื่อเดียวกันแล้ว",
      });
      return;
    }

    try {
      await createPayBy({
        Pay_By_Name: newPayOption.name,
        Pay_By_Desc: newPayOption.desc,
        Pay_By_Active: "Y", // Default to "ไม่เผยแพร่" (Inactive)
        Created_By: "Admin", // Replace with actual creator
      });
  
      toast.dismiss();
      Swal.fire({
        icon: "success",
        title: "สร้าง วิธีการจ่ายเงิน สำเร็จ",
      });
      setOpen(false);
      fetchPayOptions(); // Refresh the list after creation
    } catch (error) {
      console.error("Failed to create pay option:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการสร้างตัวเลือกการจ่ายเงิน",
      });
    }
  };
  
  const handleSaveEdit = async () => {
    // Ensure duplicate check before proceeding
    if (
      isDuplicatePayByName(
        editPayOption.Pay_By_Name,
        payOptions,
        editPayOption.Pay_By_Id
      )
    ) {
      toast.dismiss();
      Swal.fire({
        icon: "warning",
        title: "มีตัวเลือกการจ่ายเงินที่มีชื่อเดียวกันแล้ว",
      });
      return;
    }

    try {
      await updatePayBy({
        Pay_By_Id: editPayOption.Pay_By_Id,
        Pay_By_Name: editPayOption.Pay_By_Name,
        Pay_By_Desc: editPayOption.Pay_By_Desc,
        Pay_By_Active: editPayOption.Pay_By_Active,
      });

      toast.dismiss();
      Swal.fire({
        icon: "success",
        title: "อัปเดต วิธีการจ่ายเงิน สำเร็จ",
      });
      handleEditClose();
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      console.error("Failed to update pay option:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตตัวเลือกการจ่ายเงิน",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Fetch the payment history data to check if the Pay_By_Id is being used
      const paymentHistory = await getHispayment();
  
      // Check if the Pay_By_Id is used in any payment history record
      const isUsedInPaymentHistory = paymentHistory.some(
        (history) => history.Pay_By_Id === id
      );
  
      if (isUsedInPaymentHistory) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบวิธีการจ่ายเงินที่ใช้งานอยู่",
        });
        return;
      }
  
      // Proceed with deletion if not used
      await deletePayBy(id);
      toast.dismiss();
      Swal.fire({
        icon: "success",
        title: "ลบวิธีการจ่ายเงินสำเร็จ",
      });
      fetchPayOptions(); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete pay by method:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการลบวิธีการจ่ายเงิน",
      });
    }
  };

  const toggleActiveStatus = async (payOption: any) => {
    try {
      await updatePayBy({
        Pay_By_Id: payOption.Pay_By_Id,
        Pay_By_Name: payOption.Pay_By_Name,
        Pay_By_Desc: payOption.Pay_By_Desc,
        Pay_By_Active: payOption.Pay_By_Active === "Y" ? "N" : "Y",
      });
      toast.dismiss();
      Swal.fire({
        icon: "success",
        title: "สถานะการใช้งานถูกอัปเดต",
      });
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      console.error("Failed to update active status:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตสถานะการใช้งาน",
      });
    }
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payOptions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(payOptions.length / itemsPerPage);

  return (
    <div style={{  fontFamily: "Arial, sans-serif" }}>
      <Header title="วิธีการจ่ายเงิน" />
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 20,
          paddingLeft: 20,
        }}
      >
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "#0B8600",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          เพิ่มรายการ +
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>ชื่อ</TableCell>
              <TableCell>คำอธิบาย</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((payOption, index) => (
                <TableRow key={payOption.Pay_By_Id}>
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell>{payOption.Pay_By_Name}</TableCell>
                  <TableCell>{payOption.Pay_By_Desc || "-"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={payOption.Pay_By_Active === "Y"}
                      onChange={() => toggleActiveStatus(payOption)}
                      inputProps={{ "aria-label": "controlled" }}
                      color="primary"
                    />
                    {payOption.Pay_By_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(payOption)}
                    >
                      รายละเอียด
                    </Button>
                    <IconButton
                      onClick={() => handleDelete(payOption.Pay_By_Id)}
                      style={{ color: "red" }}
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

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handleClick(page)}
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
            label="วิธีการจ่ายเงิน"
            type="text"
            fullWidth
            value={newPayOption.name}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
                },
              },
            }}
          />
          <TextField
            margin="dense"
            name="desc"
            label="คำอธิบาย"
            type="text"
            fullWidth
            value={newPayOption.desc}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
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

      {editPayOption && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขวิธีการจ่ายเงิน</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="Pay_By_Name"
              label="วิธีการจ่ายเงิน"
              type="text"
              fullWidth
              value={editPayOption.Pay_By_Name}
              onChange={handleEditChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent', // Remove the border
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent', // Remove the border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent', // Remove the border when focused
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              name="Pay_By_Desc"
              label="คำอธิบาย"
              type="text"
              fullWidth
              value={editPayOption.Pay_By_Desc}
              onChange={handleEditChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent', // Remove the border
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent', // Remove the border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent', // Remove the border when focused
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PayByContent;

