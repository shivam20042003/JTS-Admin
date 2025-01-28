import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VendorOrders from './Order';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with isSidebarOpen Prop */}
      <Sidebar isOpen={isSidebarOpen}/>

      {/* Main Content */}
      <div className={`flex-1 h-screen transition-all ${false ? 'ml-64' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <VendorOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;