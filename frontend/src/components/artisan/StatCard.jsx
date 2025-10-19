import React from 'react';
import { Link } from 'react-router-dom';

const StatCardContent = ({ stat }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full border-l-8 ${stat.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${stat.bgColor}/10 ${stat.color}`}>{stat.icon}</div>
      <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
    </div>
    <div>
      <p className="text-3xl font-extrabold text-gray-800 mb-1">{stat.value}</p>
      <p className="text-sm text-gray-600">{stat.description}</p>
    </div>
  </div>
);

const StatCard = ({ stat }) => (
  stat.link.startsWith('/') ?
    <Link to={stat.link} className="block h-full">
      <StatCardContent stat={stat} />
    </Link> :
    <a href={stat.link} className="block h-full cursor-pointer">
      <StatCardContent stat={stat} />
    </a>
);

export default StatCard;