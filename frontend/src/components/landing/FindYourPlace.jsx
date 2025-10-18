import React from "react";
import { Link } from "react-router-dom";

const FindYourPlace = () => (
  <section id="findyourplace" className="py-20 bg-gray-50 relative">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-black">Find Your Place in Our Community</span>
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you create, collect, invest, or champion, there's a vital role for you at KalaGhar.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/artisan" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-yellow mb-3">For Artisans</h4>
            <p className="text-gray-600 leading-relaxed">Showcase your craft, access powerful tools, and sell to a global audience that values your unique talent.</p>
          </div>
          <div className="h-2 bg-google-yellow"></div>
        </Link>
        <Link to="/buyer" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-green mb-3">For Buyers</h4>
            <p className="text-gray-600 leading-relaxed">Discover authentic, handcrafted treasures. Connect with creators and own a piece of their story.</p>
          </div>
          <div className="h-2 bg-google-green"></div>
        </Link>
        <Link to="/buyer" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-blue mb-3">For Investors</h4>
            <p className="text-gray-600 leading-relaxed">Fund creative projects with real impact. Support the growth of cultural heritage and sustainable businesses.</p>
          </div>
          <div className="h-2 bg-google-blue"></div>
        </Link>
        <Link to="/ambassador" className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
          <div className="p-8">
            <h4 className="text-3xl font-bold text-google-red mb-3">For Ambassadors</h4>
            <p className="text-gray-600 leading-relaxed">Be a champion for artisans. Volunteer your passion to mentor, connect, and empower creators in your community.</p>
          </div>
          <div className="h-2 bg-google-red"></div>
        </Link>
      </div>
    </div>
  </section>
);

export default FindYourPlace;