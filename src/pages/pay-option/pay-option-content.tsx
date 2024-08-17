import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

} from "@mui/material";
import { getPayOption, createPayOption } from "../../services/pay-option.service"; // Updated import
import Header from "../common/header"; // Assuming you have a reusable Header component
import { toast } from "react-hot-toast";

const PayOptionContent: React.FC = () => {
  const [payOptions, setPayOptions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newPayOption, setNewPayOption] = useState({
    name: "",
    desc: "",
    active: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayOptions = async () => {
      try {
        const data = await getPayOption();
        console.log("Fetched Pay Options:", data);
        if (data && data.payOptions) {
          setPayOptions(data.payOptions);
        } else {
          setPayOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch pay options:", error);
        toast.error(`ไม่สามารถสร้างตัวเลือกการจ่ายเงินได้: ${error}`);
      }
    };

    fetchPayOptions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayOption({
      ...newPayOption,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      console.log("Creating new pay option:", newPayOption);
      await createPayOption({
        Pay_Opt_Name: newPayOption.name,
        Pay_Opt_Desc: newPayOption.desc,
        Pay_Opt_Active: newPayOption.active,
        Created_By: "Admin", // Replace with actual creator
      });
      setOpen(false);
      // Refresh the list after creation
      const data = await getPayOption();
      setPayOptions(data.payOptions);
    } catch (error) {
      console.error("Failed to create pay option:", error);
      toast.error(`ไม่สามารถสร้างตัวเลือกการจ่ายเงินได้: ${error}`);
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header title="ตัวเลือกการจ่ายเงิน" />
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
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((payOption, index) => (
            <div
              key={payOption.Pay_Opt_Id}
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
                {payOption.Pay_Opt_Name}
              </div>
              <div style={{ flex: 2, color: "black" }}>
                {payOption.Pay_Opt_Desc || "-"}
              </div>
              <div
                style={{
                  flex: 1,
                  color: "white",
                  backgroundColor:
                    payOption.Pay_Opt_Active === "Y" ? "green" : "gray",
                  padding: "5px",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {payOption.Pay_Opt_Active === "Y" ? "ใช้งาน" : "ไม่ใช้งาน"}
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
            label="Pay Option Name"
            type="text"
            fullWidth
            value={newPayOption.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="desc"
            label="Description"
            type="text"
            fullWidth
            value={newPayOption.desc}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="active-label">Active (Y/N)</InputLabel>
            <Select
              labelId="active-label"
              name="active"
              value={newPayOption.active}
              onChange={handleChange}
              label="Active (Y/N)"
            >
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
            </Select>
          </FormControl>
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
    </div>
  );
};

export default PayOptionContent;