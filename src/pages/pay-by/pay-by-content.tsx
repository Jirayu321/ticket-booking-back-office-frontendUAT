import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getPayBy,
  createPayBy,
  updatePayBy,
  deletePayBy,
} from "../../services/pay-by.service";
import Header from "../common/header";
import toast from "react-hot-toast";

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
      toast.error("ไม่สามารถดึงตัวเลือกการจ่ายเงินได้");
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

  const handleCreate = async () => {
    try {
      await createPayBy({
        Pay_By_Name: newPayOption.name,
        Pay_By_Desc: newPayOption.desc,
        Pay_By_Active: "N", // Default to "ไม่เผยแพร่" (Inactive)
        Created_By: "Admin", // Replace with actual creator
      });
      setOpen(false);
      fetchPayOptions(); // Refresh the list after creation
    } catch (error) {
      console.error("Failed to create pay option:", error);
      toast.error("ไม่สามารถสร้างตัวเลือกการจ่ายเงินได้");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updatePayBy({
        Pay_By_Id: editPayOption.Pay_By_Id,
        Pay_By_Name: editPayOption.Pay_By_Name,
        Pay_By_Desc: editPayOption.Pay_By_Desc,
        Pay_By_Active: editPayOption.Pay_By_Active,
      });
      toast.success("อัพเดทตัวเลือกการจ่ายเงินสำเร็จ");
      handleEditClose();
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตตัวเลือกการจ่ายเงิน");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePayBy(id);
      toast.success("ลบวิธีการจ่ายเงินสำเร็จ");
      fetchPayOptions(); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete pay by:", error);
      toast.error("ล้มเหลวระหว่างลบวิธีการจ่ายเงิน");
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
      toast.success("สถานะวิธีการจ่ายเงินได้รับการอัปเดตแล้ว");
      fetchPayOptions(); // Refresh data after updating
    } catch (error) {
      console.error("Failed to update active status:", error);
      toast.error("ล้มเหลวระหว่างอัปเดตสถานะวิธีการจ่ายเงิน");
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
    <div>
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
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#f5f5f5",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          <div style={{ flex: 1, color: "black" }}>ลำดับ</div>
          <div style={{ flex: 1, color: "black" }}>ชื่อ</div>
          <div style={{ flex: 2, color: "black" }}>คำอธิบาย</div>
          <div style={{ flex: 1, color: "black" }}>สถานะ</div>
          <div style={{ flex: 1, color: "black" }}>จัดการ</div>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((payOption, index) => (
            <div
              key={payOption.Pay_By_Id}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ flex: 1, color: "black" }}>
                {indexOfFirstItem + index + 1}
              </div>
              <div style={{ flex: 1, color: "black" }}>
                {payOption.Pay_By_Name}
              </div>
              <div style={{ flex: 2, color: "black" }}>
                {payOption.Pay_By_Desc || "-"}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Switch
                  checked={payOption.Pay_By_Active === "Y"}
                  onChange={() => toggleActiveStatus(payOption)}
                  inputProps={{ "aria-label": "controlled" }}
                  color="primary"
                />
                <span>
                  {payOption.Pay_By_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                </span>
              </div>
              <div style={{ flex: 1 }}>
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
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "10px 20px", color: "black" }}>
            No pay options available
          </div>
        )}
      </div>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: "#ddd",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              cursor: "pointer",
              backgroundColor: currentPage === index + 1 ? "#007bff" : "#ddd",
              color: currentPage === index + 1 ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            backgroundColor: "#ddd",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &gt;
        </button>
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
          />
          <TextField
            margin="dense"
            name="desc"
            label="คำอธิบาย"
            type="text"
            fullWidth
            value={newPayOption.desc}
            onChange={handleChange}
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
            />
            <TextField
              margin="dense"
              name="Pay_By_Desc"
              label="คำอธิบาย"
              type="text"
              fullWidth
              value={editPayOption.Pay_By_Desc}
              onChange={handleEditChange}
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
