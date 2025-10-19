import React from "react";

const Footer = () => (
  <footer className="bg-google-blue text-white">
     <section id="contact" ></section>
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-4">KalaGhar</h4>
          <p className="text-white/80 text-sm"> Empowering Artisans Worldwide. </p>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Explore</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> About Us </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Careers </a> </li> </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Connect</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Instagram </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Twitter </a> </li> </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-4">Legal</h5>
          <ul> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Terms </a> </li> <li className="mb-2"> <a href="#" className="hover:text-google-yellow transition-colors"> Privacy </a> </li> </ul>
        </div>
      </div>
      <div className="border-t border-white/30 mt-8 pt-8 text-center text-white/70 text-sm"> &copy; {new Date().getFullYear()} KalaGhar. All Rights Reserved. </div>
    </div>
  </footer>
);

export default Footer;