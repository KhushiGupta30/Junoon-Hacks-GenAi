import React from "react";
import AnimatedSection from "../../components/common/AnimatedSection";

const MyProducts = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <AnimatedSection>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Products</h1>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-600">
            This is where you will add, edit, and manage all your product
            listings.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default MyProducts;
