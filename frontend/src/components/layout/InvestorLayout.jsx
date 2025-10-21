import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end={to.endsWith("dashboard")}
    className={({ isActive }) =>
      `flex items-center h-16 text-sm font-medium transition-all duration-150 ease-in-out border-b-2 ${
        isActive
          ? "text-google-blue border-google-blue"
          : "text-gray-600 border-transparent hover:text-google-blue"
      }`
    }
  >
    {children}
  </NavLink>
);


const InvestorHeader = () => {
    const { user, logout } = useAuth();
    // Simplified header for investors
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50">
            <div className="w-full">
                <div className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
                    <div className="flex items-center h-16">
                         <NavLink to="/investor/dashboard" className="flex items-center space-x-3 mr-8 flex-shrink-0">
                            <img src="/logo.png" alt="KalaGhar Logo" className="h-10 w-10 object-contain" />
                            <h1 className="text-3xl font-bold text-gray-800 tracking-tighter hidden sm:block">
                                Kala<span className="text-google-blue">Ghar</span>
                            </h1>
                        </NavLink>
                        <nav className="hidden md:flex items-center h-16 space-x-7">
                            <NavItem to="/investor/dashboard">Dashboard</NavItem>
                            <NavItem to="/investor/browse-artisans">Browse Artisans</NavItem>
                            <NavItem to="/investor/portfolio">My Portfolio</NavItem>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={logout} className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            <LogOut size={16} className="mr-2" /> Sign out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};


const InvestorLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <InvestorHeader />
            <main className="pt-16">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default InvestorLayout;