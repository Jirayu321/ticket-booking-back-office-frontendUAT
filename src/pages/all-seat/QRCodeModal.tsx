import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import "../../index.css";
import { FC, useState, useEffect } from "react";
import { SwalError } from "../../lib/sweetalert";
import { getViewTicketList } from "../../services/view-tikcet-list.service";
import { updateOrderbyticketid } from "../../services/order-all.service";
import CloseIcon from "@mui/icons-material/Close";

type QRCodeModalProps = {
  open: boolean;
  handleClose: () => void;
  ticketData: {
    ticket_id: string;
    Event_Name: string;
    Event_Date: string;
    Event_Time: string;
    Plan_Name: string;
    ticket_line: number;
    Web_Qty_Buy: number;
    ticket_no: string;
    print_count: number;
    order_id: number;
  };
};

const QRCodeModal: FC<QRCodeModalProps> = ({
  open,
  handleClose,
  ticketData,
}) => {
  const {
    ticket_id,
    Event_Name,
    Event_Date,
    Event_Time,
    Plan_Name,
    ticket_line,
    ticket_no,
    print_count,
    order_id,
  } = ticketData;

  const [totalTicketsWithSameNo, setTotalTicketsWithSameNo] =
    useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Fetch the tickets and count how many have the same ticket_no and order_id
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getViewTicketList(); // Fetch ticket list
        console.log("Fetched Data:", data); // Log the fetched data

        if (data && Array.isArray(data.ticketList)) {
          const matchingTickets = data.ticketList.filter(
            (ticket) =>
              ticket.ticket_no === ticket_no && ticket.order_id === order_id
          );
          console.log("Filtered Tickets:", matchingTickets); // Log the filtered tickets
          setTotalTicketsWithSameNo(matchingTickets.length);
        } else {
          console.log("Data is not an array:", data); // Log if data is not an array
          setTotalTicketsWithSameNo(0); // Set 0 if no data found
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error); // Log the error
        SwalError("Failed to fetch ticket data.");
        setTotalTicketsWithSameNo(0);
      }
    };

    if (open) {
      fetchTickets();
    }
  }, [open, ticket_no, order_id]);

  useEffect(() => {
    const generateQR = async (ticket_id: string) => {
      if (
        !ticket_id ||
        typeof ticket_id !== "string" ||
        ticket_id.trim() === ""
      ) {
        console.error("Invalid ticket_id for QR code generation");
        SwalError("Invalid ticket ID provided for generating QR code.");
        return;
      }

      try {
        const url = await QRCode.toDataURL(ticket_id);
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
        SwalError("Failed to generate QR code.");
      }
    };

    if (open) {
      generateQR(ticket_id.toString()); // Ensure ticket_id is always a string
    }
  }, [open, ticket_id]);

  async function handlePrintQr() {
    if (!qrCodeUrl) {
      SwalError("ไม่สามารถพิมพ์บัตรที่นั่งได้");
      return;
    }
    const dataprint = await updateOrderbyticketid(order_id, ticket_id);
    console.log("dataprint", dataprint);
    const printWindow = window.open("", "_blank");

    printWindow?.document.write(`
    <html>
      <head>
        <title>Print QR Codes</title>
            <style>
              body { margin: 0; padding: 0; }
              .ticket-container {
                text-align: center;
              }
              img { width: 90%; height: 80%; margin:0px; }
              p {
                font-size: 40px;
                font-weight: bold; 
                color: #333;
                margin:0px;
              }
              .details {
                font-size: 40px;
                color: #666;
                 margin:0px;
              }
                 .divbody{
                position: relative;
                top: -45px;
                 }
            </style>
      </head>
      <body>
  <div class="ticket-container">
            <img src="${qrCodeUrl}"/>
          <div class="divbody">
          <p class="details">${Event_Name}</p>
          <p class="details">
          (เบอร์โต๊ะ: ${ticket_no})
          </p>
            <p class="details">เวลา: ${new Date(Event_Date).toLocaleDateString(
              "th-TH",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )} - ${new Date(
      new Date(Event_Time).getTime() - 7 * 60 * 60 * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })} น.</p>
          </div>
           
          
          </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);

    printWindow?.document.close();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
            mt: 3,
          }}
        >
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" width={256} />
          ) : (
            <Typography>Loading QR Code...</Typography>
          )}
        </Box>
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{ mb: 2 }}
          style={{ color: "black" }}
        >
          {Event_Name}
        </Typography>
        <Typography variant="body1" align="center" style={{ color: "black" }}>
          <CalendarTodayIcon
            style={{ verticalAlign: "middle", marginRight: "4px" }}
          />
          {new Date(Event_Date).toLocaleDateString("en-GB")}
          <AccessTimeIcon
            style={{
              verticalAlign: "middle",
              marginLeft: "100px",
              marginRight: "4px",
            }}
          />
          {new Date(
            new Date(Event_Time).getTime() - 7 * 60 * 60 * 1000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </Typography>
        <Typography variant="body2" align="center" style={{ color: "black" }}>
          {Plan_Name} - ที่นั่ง {ticket_line}/{totalTicketsWithSameNo}{" "}
          (เบอร์โต๊ะ {ticket_no})
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrintQr}
          sx={{ marginTop: "16px", width: "100%" }}
        >
          พิมพ์บัตรที่นั่ง
        </Button>
        <Typography
          variant="caption"
          align="center"
          sx={{ mt: 2, display: "block" }}
        >
          ครั้งที่พิมพ์: {print_count}
        </Typography>
      </Box>
    </Modal>
  );
};

export default QRCodeModal;
