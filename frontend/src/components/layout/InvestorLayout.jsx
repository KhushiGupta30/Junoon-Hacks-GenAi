import React from 'react';
import { Outlet } from 'react-router-dom';
import InvestorHeader from './InvestorHeader';

const InvestorLayout = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <InvestorHeader />
      <main className="main-page-content flex-1 overflow-y-auto pt-16 pb-8"></main>
      <Outlet />
      {}
    </div>
  );
};

export default InvestorLayout;