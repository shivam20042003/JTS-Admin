import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg w-64">
      <div className="p-6 bg-gray-900 text-center text-l font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4 space-y-3 px-4">
        <Link to="/dashboard" className="block p-3 hover:bg-gray-700 rounded-md">
          Dashboard
        </Link>
        <Link to="/products" className="block p-3 hover:bg-gray-700 rounded-md">
          Products
        </Link>
        <Link to="/profile" className="block p-3 hover:bg-gray-700 rounded-md">
          Profile
        </Link>
      </nav>
    </div>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60 bg-gray-100">
        {/* Navbar */}
       

        {/* Content Area */}
        <div className="p-2 overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;