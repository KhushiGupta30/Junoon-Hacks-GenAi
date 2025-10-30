import React from "react";

const SkeletonStat = () => (
  <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100 animate-pulse h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      {}
      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      {}
      <div className="w-9 h-9 rounded-full bg-gray-200"></div>
    </div>
    <div className="mt-auto">
      {}
      <div className="h-8 md:h-10 w-1/2 bg-gray-200 rounded mb-2"></div>
      {}
      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default SkeletonStat;
