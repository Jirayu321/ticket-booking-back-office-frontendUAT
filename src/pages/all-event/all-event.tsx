import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import AllEventContent from './all-event-content';
import './all-event.css';

const AllEvent: React.FC = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <AllEventContent />
      </div>
    </div>
  );
};

export default AllEvent;
