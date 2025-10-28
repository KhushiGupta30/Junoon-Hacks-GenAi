import React from 'react';
import { Outlet } from 'react-router-dom';
import InvestorHeader from './InvestorHeader'; // Assuming InvestorHeader.jsx is in the same folder

const InvestorLayout = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <InvestorHeader />
      {/* Outlet renders the nested buyer routes */}
      <Outlet />
      {/* <Footer /> Optionally add Footer if needed for all buyer pages */}
    </div>
  );
};

export default InvestorLayout;