import React from "react";

const Hero = () => (
    <section className="min-h-screen flex items-center justify-center pt-24 md:pt-0 bg-cover bg-center relative text-center" style={{ backgroundImage: "url('/1.png')" }} >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4"> Where <span className="text-google-yellow">Artistry</span> Meets{" "} <span className="text-google-blue">Opportunity</span>. </h2>
          <p className="text-lg text-white/90 font-medium mb-8"> </p>
          <a href="#roles" className="bg-google-red text-white font-bold px-8 py-4 rounded-full hover:bg-google-blue transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-xl" > Join Our Community </a>
        </div>
      </div>
    </section>
);

export default Hero;