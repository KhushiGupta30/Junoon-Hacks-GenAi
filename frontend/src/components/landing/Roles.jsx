import React from "react";
import AnimatedSection from "../ui/AnimatedSection";
import {
  ArtisanIcon,
  BuyerIcon,
  InvestorIcon,
  AmbassadorIcon,
} from "../common/Icons";

const rolesData = [
  {
    name: "Artisan",
    description: "Showcase your craft.",
    icon: <ArtisanIcon />,
  },
  {
    name: "Buyer",
    description: "Discover unique products.",
    icon: <BuyerIcon />,
  },
  {
    name: "Investor",
    description: "Fund creative projects.",
    icon: <InvestorIcon />,
  },
  {
    name: "Ambassador",
    description: "Champion artisans.",
    icon: <AmbassadorIcon />,
  },
];

const Roles = ({ onRoleSelect }) => {
  return (
    <section id="roles" className="py-20 bg-cover bg-center relative">
      <div className="container mx-auto px-6 text-center">
        <AnimatedSection>
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            {" "}
            Apply Now!{" "}
          </h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            {" "}
            Whether you create, collect, invest, or champion, KalaGhar has a
            place for you.{" "}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rolesData.map((role) => (
            <AnimatedSection key={role.name}>
              <div
                onClick={() => onRoleSelect(role.name)}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-google-blue hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center h-full"
              >
                {role.icon}
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {" "}
                  {role.name}{" "}
                </h4>
                <p className="text-gray-600">{role.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roles;
