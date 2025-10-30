import React from "react";
import { Outlet } from "react-router-dom";
import BuyerHeader from "./BuyerHeader";

const BuyerLayout = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <BuyerHeader />
      {}
      <Outlet />
      {}
    </div>
  );
};

export default BuyerLayout;
