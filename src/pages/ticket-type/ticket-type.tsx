import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import TicketTypeContent from './ticket-type-content'; // Import the content component

const TicketTypePage: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar Component */}
      <div style={{ paddingLeft:140,marginTop:-20, flex: 1 ,width:1800}}>
        <TicketTypeContent /> {/* Ticket type content */}
      </div>
    </div>
  );
};

export default TicketTypePage;