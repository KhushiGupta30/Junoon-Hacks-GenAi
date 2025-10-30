import React, { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote:
      "KalaGhar didn't just give me a marketplace; it gave my craft a global voice. My sales have tripled, connecting me with buyers who truly appreciate my heritage.",
    name: "Priya S.",
    role: "Textile Weaver from Rajasthan",
  },
  {
    quote:
      "As a buyer, discovering authentic, handmade pieces with rich stories behind them has been a joy. This platform is a treasure trove of culture.",
    name: "David L.",
    role: "Art Collector from New York",
  },
  {
    quote:
      "Volunteering as an Ambassador has been incredibly fulfilling. I'm helping preserve my community's traditions by bridging our local artisans to the world.",
    name: "Rohan D.",
    role: "KalaGhar Ambassador from Gujarat",
  },
];

const WhatIsKalaGhar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const handleNext = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsFading(false);
    }, 300);
  }, [isFading]);
  const handlePrev = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      );
      setIsFading(false);
    }, 300);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);
  const { quote, name, role } = testimonials[currentIndex];
  return (
    <section id="WhatIsKalaGhar" className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h3 className="text-4xl font-bold text-gray-800 mb-6">
              {" "}
              What is <span className="text-black">Kala</span>{" "}
              <span className="text-google-blue">Ghar</span>?{" "}
            </h3>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {" "}
              KalaGhar is a digital ecosystem designed to celebrate and empower
              artisans by connecting them with buyers, investors, and
              ambassadors worldwide. We bridge tradition with technology,
              helping preserve cultural heritage while creating sustainable
              growth opportunities.{" "}
            </p>
          </div>
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8 relative overflow-hidden min-h-[280px] flex items-center">
              <svg
                className="absolute top-4 left-6 w-16 h-16 text-gray-200 opacity-50 transform -translate-x-4"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.333 22.667h4L15.333 16h-4L9.333 22.667zM22.667 22.667h4L28.667 16h-4L22.667 22.667zM4 28c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2h-8L8 4H4v12h6v12H6c-1.1 0-2 .9-2 2zM18 28c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2h-8l-4-10h-4v12h6v12h-2c-1.1 0-2 .9-2 2z"></path>
              </svg>
              <div
                className={`w-full relative z-10 transition-opacity duration-300 ease-in-out ${
                  isFading ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="text-xl italic text-gray-700 mb-6 font-serif">
                  {" "}
                  "{quote}"{" "}
                </p>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{name}</p>
                  <p className="text-sm text-google-blue font-medium">{role}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20"
              aria-label="Next testimonial"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsKalaGhar;
