import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import QRCode from 'qrcode.react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const QRCodeModal = ({ open, handleClose, ticketData }) => {
  const {
    ticket_id,
    Event_Name,
    Event_Date,
    Event_Time,
    Plan_Name,
    ticket_line,
    Web_Qty_Buy,
    ticket_no,
    print_count,
  } = ticketData;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <QRCode value={ticket_id} size={256} />
        </Box>
        <Typography variant="h6" component="h2" align="center" sx={{ mb: 2 }} style={{color:"black"}}>
          {Event_Name}
        </Typography>
        <Typography variant="body1" align="center" style={{ color: "black" }}>
          <CalendarTodayIcon style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          {new Date(Event_Date).toLocaleDateString('en-GB')}
          <AccessTimeIcon style={{ verticalAlign: 'middle', marginLeft: '100px', marginRight: '4px' }} />
          {new Date(Event_Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </Typography>
        <Typography variant="body2" align="center" style={{color:"black"}}>
          {Plan_Name} - {ticket_line}/{Web_Qty_Buy} ({ticket_no})
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.print()} // Implement actual print functionality as needed
          sx={{ marginTop: '16px', width: '100%' }}
        >
          พิมพ์บัตรที่นั่ง
        </Button>
        <Typography variant="caption" align="center" sx={{ mt: 2, display: 'block' }}>
          ครั้งที่พิมพ์: {print_count}
        </Typography>
      </Box>
    </Modal>
  );
};

export default QRCodeModal;
