import React from "react";
import { Link } from "react-router-dom";

import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
} from "../../components/common/Icons";

const RawMaterialsPage = () => {
  const ourPromisePoints = [
    "100% Chain-of-Custody Traceability",
    "Fair-Trade & Living Wage Certified",
    "Sustainable Harvesting Practices",
    "Reduced Carbon Footprint Logistics",
    "Exclusive Pricing for KalaGhar Artisans",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-15 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      {}
      <div className="flex-grow lg:w-2/3">
        <AnimatedSection className="mb-8">
          {}
          <Link
            to="/artisan/logistics"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Logistics
          </Link>

          {}
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Our Ethical Supply Chain
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            From the source to your workshop, we guarantee quality and integrity
            every step of the way.
          </p>
        </AnimatedSection>

        {}
        <div className="space-y-8">
          {}
          <AnimatedSection>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-google-green/10 rounded-full">
                <GlobeAltIcon className="w-8 h-8 text-google-green" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-google-green tracking-wider">
                  Step 1
                </span>
                <h2 className="text-xl font-medium text-gray-800 mt-1">
                  Certified Ethical Sourcing
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  We partner directly with certified co-ops and suppliers who
                  adhere to strict fair-trade and sustainable harvesting
                  standards. By removing middlemen, we ensure that the producers
                  are paid fairly and that you receive the purest, most ethical
                  materials.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {}
          <AnimatedSection>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-google-blue/10 rounded-full">
                <TruckIcon className="w-8 h-8 text-google-blue" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-google-blue tracking-wider">
                  Step 2
                </span>
                <h2 className="text-xl font-medium text-gray-800 mt-1">
                  Proprietary Global Logistics
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Our vertically integrated logistics network gives us full
                  control over the shipping process. This means materials are
                  handled with care, costs are kept low, and we can provide you
                  with transparent, end-to-end tracking from the farm to your
                  studio.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {}
          <AnimatedSection>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-google-yellow/10 rounded-full">
                <ShieldCheckIcon className="w-8 h-8 text-google-yellow" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-google-yellow tracking-wider">
                  Step 3
                </span>
                <h2 className="text-xl font-medium text-gray-800 mt-1">
                  End-to-End Quality Control
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Quality is not just a final check. We inspect every batch of
                  raw material at the source and again upon arrival at our
                  distribution hubs. We guarantee that every item you purchase
                  meets our exacting standards for purity, durability, and
                  ethical integrity.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {}
      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
        {}
        <AnimatedSection>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <BuildingStorefrontIcon className="h-6 w-6 text-google-blue" />
              <h3 className="text-base font-medium text-gray-800">
                Source Your Materials
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Ready to get started? Browse our catalog of ethically sourced raw
              materials.
            </p>
            <Link
              to="/artisan/materials-catalog"
              className="inline-flex items-center gap-2 justify-center w-full rounded-md border border-transparent bg-google-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Browse Catalog
            </Link>
          </div>
        </AnimatedSection>

        {}
        <AnimatedSection>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="h-6 w-6 text-google-green" />
              <h3 className="text-base font-medium text-gray-800">
                Our Promise
              </h3>
            </div>
            <ul className="space-y-2.5">
              {ourPromisePoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-google-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </aside>
    </div>
  );
};

export default RawMaterialsPage;
