import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ArtisanHeader from './ArtisanHeader'; // Adjust path if needed
import Footer from './Footer';             // Adjust path if needed
import Mic from '../Mic';                         // Adjust path if needed

const ArtisanLayout = () => {
  // The header component needs auth data, so we get it here
  const { user, logout } = useAuth();

  // The ProtectedRoute in App.jsx will handle redirecting if !user,
  // so we can safely assume 'user' exists here.
  
  return (
    <div className="main-bg min-h-screen font-sans flex flex-col justify-between">
      <div>
        {/* The Header is rendered ONCE, outside the changing content */}
        <ArtisanHeader user={user} logout={logout} />

        {/* pt-24 (96px) is a common height for a fixed header.
          Adjust this value to match your ArtisanHeader's exact height
          to prevent content from hiding underneath it.
        */}
        <main className="pt-4">
          {/* Outlet is the "content area" where your pages will be loaded */}
          <Outlet />
        </main>
      </div>

      {/* The Footer and Mic are also shared */}
      <Footer />
      <Mic />
    </div>
  );
};

export default ArtisanLayout;