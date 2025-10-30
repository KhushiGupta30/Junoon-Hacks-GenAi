import React from "react";
import { Link } from "react-router-dom";

const StatCard = ({ stat }) => {
  const CardContent = () => (
    <div
      className={`bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 ease-in-out h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        {}
        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
        {}
        <div className={`p-2 rounded-full ${stat.bgColor}/10 ${stat.color}`}>
          {React.cloneElement(stat.icon, { className: "h-5 w-5" })} {}
        </div>
      </div>
      <div className="mt-auto">
        {" "}
        {}
        {}
        <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          {stat.value}
        </p>
        {}
        {stat.description && (
          <p className="text-xs text-gray-600">{stat.description}</p>
        )}
      </div>
    </div>
  );

  return stat.link ? (
    <Link to={stat.link} className="block h-full">
      <CardContent />
    </Link>
  ) : (
    <div className="block h-full cursor-default">
      {" "}
      {}
      <CardContent />
    </div>
  );
};

export default StatCard;
