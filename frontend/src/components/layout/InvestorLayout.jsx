import React from 'react';
import { Outlet } from 'react-router-dom';
import InvestorHeader from './InvestorHeader';

const InvestorLayout = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <InvestorHeader />
      {}
      <Outlet />
      {}
    </div>
  );
};

export default InvestorLayout;