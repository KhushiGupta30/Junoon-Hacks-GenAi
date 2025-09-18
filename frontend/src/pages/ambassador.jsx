import React, { useState, useEffect, useRef } from "react";

// --- Reusable Animated Section ---
const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}{" "}
    </div>
  );
};

// --- Icon Components for Modal ---
const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);
const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);
const LocationIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

// --- Application Modal Component ---
const ApplicationModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    reason: "",
    skills: "",
  });
  const modalRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application Submitted:", formData);
    alert("Thank you for your application! We will be in touch soon.");
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300 ease-out transform scale-95 opacity-0 animate-fade-in-scale"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-google-red transition-colors"
          aria-label="Close application form"
        >
          <CloseIcon />
        </button>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Join as an <span className="text-google-yellow">Ambassador</span>
          </h3>
          <p className="text-gray-500 mb-6">
            We're excited to have you. Let's get you started.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserIcon />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-yellow transition-colors"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-yellow transition-colors"
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LocationIcon />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-yellow transition-colors"
                placeholder="Your City / Region"
              />
            </div>
            <textarea
              name="reason"
              rows="3"
              value={formData.reason}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-yellow transition-colors resize-none"
              placeholder="Why do you want to join?"
            ></textarea>
            <textarea
              name="skills"
              rows="2"
              value={formData.skills}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:border-google-yellow transition-colors resize-none"
              placeholder="Relevant skills or experience?"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-google-yellow text-white font-bold px-10 py-3 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Page Hero Component ---
const PageHero = ({
  title,
  highlightText,
  subtitle,
  backgroundImage,
  highlightColorClass = "text-google-blue",
}) => (
  <section
    className="min-h-[60vh] flex items-center justify-center pt-24 bg-cover bg-[center_bottom_30%] relative text-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
        <div className="absolute inset-0 bg-black/50"></div>   {" "}
    <div className="container mx-auto px-6 relative z-10">
           {" "}
      <AnimatedSection>
               {" "}
        <div className="max-w-3xl mx-auto">
                   {" "}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                        {title}            {" "}
            <span className={highlightColorClass}>{highlightText}</span>       
             {" "}
          </h1>
                   {" "}
          <p className="text-lg text-white/90 font-medium">
                        {subtitle}         {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </AnimatedSection>
         {" "}
    </div>
     {" "}
  </section>
);

// --- Call To Action Component ---
const CallToAction = ({
  onApplyClick,
  roleName,
  buttonColorClass = "bg-google-red",
}) => (
  <section className="py-20 bg-gray-100">
       {" "}
    <div className="container mx-auto px-6 text-center">
           {" "}
      <AnimatedSection>
               {" "}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Ready to Volunteer Your Passion?
        </h2>
               {" "}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Join our network of KalaGhar Ambassadors and dedicate your
          time to a cause that matters. Your effort can change lives.        {" "}
        </p>
               {" "}
        <button
          onClick={onApplyClick}
          className={`${buttonColorClass} text-white font-bold px-10 py-4 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
        >
                    Volunteer as an {roleName}       {" "}
        </button>
             {" "}
      </AnimatedSection>
         {" "}
    </div>
     {" "}
  </section>
);

// --- Main AmbassadorPage Component ---
const AmbassadorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <style>{`
        .bg-google-blue { background-color: #4285F4; } .text-google-blue { color: #4285F4; }
        .bg-google-red { background-color: #DB4437; } .text-google-red { color: #DB4437; }
        .bg-google-yellow { background-color: #F4B400; } .text-google-yellow { color: #F4B400; }
        .bg-google-green { background-color: #0F9D58; } .text-google-green { color: #0F9D58; }
        .focus\\:border-google-yellow:focus { border-color: #F4B400; }
        @keyframes fade-in-scale {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
      `}</style>
           {" "}
      <PageHero
        title="Be a Beacon for"
        highlightText="Local Artisans"
        subtitle="Dedicate your passion to a greater cause. Empower local creators, preserve our cultural heritage, and make a tangible impact in your community."
        backgroundImage="/1.png" // A background image representing community/heritage
        highlightColorClass="text-google-yellow"
      />
            {/* --- Features Section --- */}     {" "}
      <section className="py-20 bg-gray-50">
               {" "}
        <div className="container mx-auto px-6 space-y-16">
                              {/* Your Volunteer Role & Impact */}         {" "}
          <AnimatedSection>
                       {" "}
            <div className="text-center">
                           {" "}
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Your Volunteer Role & Impact 🤝
              </h2>
                           {" "}
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                As a volunteer KalaGhar Ambassador, you will be the cornerstone
                of our mission, driving change from the ground up.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="grid md:grid-cols-3 gap-8 text-left">
                           {" "}
              <div className="bg-white p-6 rounded-lg shadow-md">
                               {" "}
                <h3 className="font-bold text-xl mb-2 text-google-blue">
                  Mentor & Guide
                </h3>
                               {" "}
                <p className="text-gray-600">
                  Be a trusted mentor and the first point of contact for
                  artisans in your area, helping them join and benefit from the
                  KalaGhar community.
                </p>
                             {" "}
              </div>
                           {" "}
              <div className="bg-white p-6 rounded-lg shadow-md">
                               {" "}
                <h3 className="font-bold text-xl mb-2 text-google-green">
                  Foster Community
                </h3>
                               {" "}
                <p className="text-gray-600">
                  Build a strong, supportive network. Organize local meetups and
                  workshops to encourage collaboration, knowledge sharing, and
                  collective growth.
                </p>
                             {" "}
              </div>
                           {" "}
              <div className="bg-white p-6 rounded-lg shadow-md">
                          _highlightText
                <h3 className="font-bold text-xl mb-2 text-google-red">
                  Champion Local Craft
                </h3>
                               {" "}
                <p className="text-gray-600">
                  Be the voice for your local artisans. Help showcase their
                  stories and unique crafts to a global audience through our
                  platform and events.
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </AnimatedSection>
                              <hr />         {" "}
          {/* Volunteer Perks & Recognition */}         {" "}
          <AnimatedSection>
                       {" "}
            <div className="text-center">
                             {" "}
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Volunteer Perks & Recognition ✨
              </h2>
                             {" "}
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                We value your time and contribution. Here are some of the perks
                we offer as a token of our gratitude.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="grid md:grid-cols-3 gap-8 text-left">
                             {" "}
              <div className="bg-white p-6 rounded-lg shadow-md">
                                   {" "}
                <h3 className="font-bold text-xl mb-2 text-google-yellow">
                  Exclusive Product Discounts
                </h3>
                                   {" "}
                <p className="text-gray-600">
                  Receive special discounts on beautiful, handcrafted products
                  from our entire network of talented artisans across the
                  country.
                </p>
                               {" "}
              </div>
                             {" "}
              <div className="bg-white p-6 rounded-lg shadow-md">
                                   {" "}
                <h3 className="font-bold text-xl mb-2 text-google-yellow">
                  Skill Development
                </h3>
                                   {" "}
                <p className="text-gray-600">
                  Gain valuable experience in community management, social
                  entrepreneurship, and digital literacy with our provided
                  training and resources.
                </p>
                               {" "}
              </div>
                               
              <div className="bg-white p-6 rounded-lg shadow-md">
                                   {" "}
                <h3 className="font-bold text-xl mb-2 text-google-yellow">
                  Certificate of Contribution
                </h3>
                                   {" "}
                <p className="text-gray-600">
                  Receive an official certificate from KalaGhar recognizing your
                  valuable volunteer work and social impact—a great addition to
                  your profile.
                </p>
                               {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </AnimatedSection>
                 {" "}
        </div>
             {" "}
      </section>
                 {" "}
      <CallToAction
        onApplyClick={() => setIsModalOpen(true)}
        roleName="Ambassador"
        buttonColorClass="bg-google-yellow"
      />
      {isModalOpen && (
        <ApplicationModal onClose={() => setIsModalOpen(false)} />
      )}
         {" "}
    </>
  );
};

export default AmbassadorPage;
