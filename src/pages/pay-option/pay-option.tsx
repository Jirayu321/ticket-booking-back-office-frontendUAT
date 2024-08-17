import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PayOptionContent from './pay-option-content'; // Import the content component

const PayOptionPage: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar Component */}
      <div style={{ paddingLeft:140,marginTop:-20, flex: 1 ,width:1800}}>
        <PayOptionContent /> {/* Ticket type content */}
      </div>
    </div>
  );
};

export default PayOptionPage;