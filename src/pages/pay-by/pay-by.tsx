import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PayByContent from './pay-by-content'; // Import the content component

const PayByPage: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar Component */}
      <div style={{ paddingLeft:140,marginTop:-20, flex: 1 ,width:1800}}>
        <PayByContent /> {/* Ticket type content */}
      </div>
    </div>
  );
};

export default PayByPage;