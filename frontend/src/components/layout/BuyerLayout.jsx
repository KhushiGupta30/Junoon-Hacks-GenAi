import React from 'react';
import { Outlet } from 'react-router-dom';
import BuyerHeader from './BuyerHeader'; // Use the BuyerHeader we created
// You might not need a separate Footer here if BuyerHeader is always visible
// import Footer from './Footer';

const BuyerLayout = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <BuyerHeader />
      {/* Outlet renders the nested buyer routes */}
      <Outlet />
      {/* <Footer /> Optionally add Footer if needed for all buyer pages */}
    </div>
  );
};

export default BuyerLayout;