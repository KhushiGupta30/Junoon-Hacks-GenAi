import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LoginModal from "../components/ui/LoginModal";
import Hero from "../components/landing/Hero";
import WhatIsKalaGhar from "../components/landing/WhatIsKalaGhar";
import FindYourPlace from "../components/landing/FindYourPlace";
import ExplainerCarousel from "../components/landing/ExplainerCarousel";
import Roles from "../components/landing/Roles";

function AboutUs() {
  const team = [
    {
      name: "Eugene Samuel",
      image: "/eugene.jpg",
      contribution: "Backend Engineer handled APIs, authentication logic, Database logic and Backend Integration",
    },
    {
      name: "Vijwal Manocha",
      image: "/vijwal.jpg",
      contribution: "Backend Engineer handled AI Integration, Hosting and Backend Integration",
    },
    {
      name: "Khushi Gupta",
      image: "/khushi.jpg",
      contribution: "Frontend Engineer designed and built the UI components and pages",
    },
    {
      name: "Bhoomi Agarwal",
      image: "/bhoomi.jpg",
      contribution: "Frontend Engineer designed and built the UI components and pages",
    },
  ];

  return (
    <section className="bg-gray-50 py-16" id="about-us">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-900">About Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="mt-2 text-gray-600 text-sm">{member.contribution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role.toLowerCase());
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedRole("");
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
        <AboutUs />
      </main>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
      />
    </div>
  );
}
