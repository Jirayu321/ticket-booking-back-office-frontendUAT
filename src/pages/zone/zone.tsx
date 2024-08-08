import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'; // Assuming you have a reusable Sidebar component
import ZoneContent from './zone-content';
import './zone-page.css';

const ZonePage: React.FC = () => {
  return (
    <div className="zone-page">
      <Sidebar />
      <div className="zone-content">
        <ZoneContent />
      </div>
    </div>
  );
};

export default ZonePage;