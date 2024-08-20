import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from "../../services/ticket-type.service";
import Header from "../common/header";
import toast from "react-hot-toast";

const TicketTypeContent: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newTicketType, setNewTicketType] = useState({
    name: "",
    unit: "",
    cal: "N", // Default value
  });
  const [editTicketType, setEditTicketType] = useState<any>(null); // For editing
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Function to fetch and set the ticket types
  const fetchTicketTypes = async () => {
    try {
      const data = await getAllTicketTypes();

      if (data && data.ticketTypes) {
        setTicketTypes(data.ticketTypes);
      } else {
        setTicketTypes([]);
      }
    } catch (error) {
      console.error("Failed to fetch ticket types:", error);
      toast.error("Failed to fetch ticket types: " + error);
    }
  };

  useEffect(() => {
    fetchTicketTypes(); // Fetch data initially
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTicketType({
      name: "",
      unit: "",
      cal: "N",
    }); // Reset the form state
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTicketType({
      ...newTicketType,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await createTicketType({
        Ticket_Type_Name: newTicketType.name,
        Ticket_Type_Unit: newTicketType.unit,
        Ticket_Type_Cal: newTicketType.cal,
      });
      toast.success("สร้างประเภทบัตรสำเร็จ");
      setNewTicketType({
        name: "",
        unit: "",
        cal: "N",
      }); // Reset the form state
      handleClose();
      fetchTicketTypes(); // Refresh data after creating
    } catch (error) {
      toast.error("ล้มเหลวระหว่างสร้างประเภทบัตร");
    }
  };

  const handleEditOpen = (ticketType: any) => {
    setEditTicketType(ticketType);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditTicketType(null);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTicketType({
      ...editTicketType,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateTicketType({
        Ticket_Type_Id: editTicketType.Ticket_Type_Id,
        Ticket_Type_Name: editTicketType.Ticket_Type_Name,
        Ticket_Type_Unit: editTicketType.Ticket_Type_Unit,
        Ticket_Type_Cal: editTicketType.Ticket_Type_Cal,
      });
      toast.success("อัปเดตประเภทบัตรสำเร็จ");
      handleEditClose();
      fetchTicketTypes(); // Refresh data after updating
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตประเภทบัตร");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTicketType(id);
      toast.success("ลบประเภทบัตรสำเร็จ");
      fetchTicketTypes(); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete ticket type:", error);
      toast.error("ล้มเหลวระหว่างลบประเภทตั๋ว");
    }
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ticketTypes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ticketTypes.length / itemsPerPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header title="ประเภทบัตร" />
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
          <div style={{ flex: 1, color: "black" }}>ชื่อประเภทบัตร</div>
          <div style={{ flex: 1, color: "black" }}>หน่วย</div>
          <div style={{ flex: 1, color: "black" }}>การคำนวณ</div>
          <div style={{ flex: 1, color: "black" }}>จัดการ</div>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((ticketType, index) => (
            <div
              key={ticketType.Ticket_Type_Id}
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
                {ticketType.Ticket_Type_Name}
              </div>
              <div style={{ flex: 1, color: "black" }}>
                {ticketType.Ticket_Type_Unit}
              </div>
              <div style={{ flex: 1, color: "black" }}>
                {ticketType.Ticket_Type_Cal}
              </div>
              <div style={{ flex: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditOpen(ticketType)}
                >
                  รายละเอียด
                </Button>
                <IconButton
                  onClick={() => handleDelete(ticketType.Ticket_Type_Id)}
                  style={{ color: "red" }} // Delete button in red
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "10px 20px", color: "black" }}>
            No ticket types available
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
        <DialogTitle>Create New Ticket Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Ticket Type Name"
            type="text"
            fullWidth
            value={newTicketType.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="unit"
            label="Unit"
            type="text"
            fullWidth
            value={newTicketType.unit}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            name="cal"
            label="Calculation (Y/N)"
            fullWidth
            value={newTicketType.cal}
            onChange={handleChange}
          >
            <MenuItem value="Y">Y</MenuItem>
            <MenuItem value="N">N</MenuItem>
          </TextField>
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
      {editTicketType && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขประเภทบัตร</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="Ticket_Type_Name"
              label="Ticket Type Name"
              type="text"
              fullWidth
              value={editTicketType.Ticket_Type_Name}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="Ticket_Type_Unit"
              label="Unit"
              type="text"
              fullWidth
              value={editTicketType.Ticket_Type_Unit}
              onChange={handleEditChange}
            />
            <TextField
              select
              margin="dense"
              name="Ticket_Type_Cal"
              label="Calculation (Y/N)"
              fullWidth
              value={editTicketType.Ticket_Type_Cal}
              onChange={handleEditChange}
            >
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </TextField>
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

export default TicketTypeContent;
