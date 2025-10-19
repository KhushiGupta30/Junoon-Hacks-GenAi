import React, { useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";
import LoginModal from "../components/ui/LoginModal";
import Hero from "../components/landing/Hero";
import WhatIsKalaGhar from "../components/landing/WhatIsKalaGhar";
import FindYourPlace from "../components/landing/FindYourPlace";
import ExplainerCarousel from "../components/landing/ExplainerCarousel";
import Roles from "../components/landing/Roles";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role.toLowerCase()); // Ensure role is lowercase for consistency
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedRole(''); // Clear role if opened from header
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans bg-white">
      <Header onLoginClick={handleOpenModal} />
      <main>
        <Hero />
        <WhatIsKalaGhar />
        <FindYourPlace />
        <ExplainerCarousel />
        <Roles onRoleSelect={handleRoleSelect} />
      </main>
      <Footer />
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        selectedRole={selectedRole}
      />
    </div>
  );
}