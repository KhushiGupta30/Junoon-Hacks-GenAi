import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  ArrowRightIcon,
  TruckIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ArchiveIcon,
  SendIcon,
} from "../../components/common/Icons";

const SkeletonBase = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);
const SkeletonHero = () => <SkeletonBase className="h-40 md:h-48" />;
const SkeletonSidebarCard = () => <SkeletonBase className="h-64" />;
const SkeletonOrderCard = () => (
  <div className="bg-white p-5 rounded-lg shadow-sm border animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-2">
        <SkeletonBase className="h-5 w-32" />
        <SkeletonBase className="h-4 w-48" />
        <SkeletonBase className="h-3 w-40" />
      </div>
      <SkeletonBase className="h-8 w-24 rounded-md" />
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
        <div className="space-y-1.5">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-3 w-32" />
        </div>
        <div className="space-y-1.5 text-right">
          <SkeletonBase className="h-5 w-16" />
          <SkeletonBase className="h-3 w-20" />
        </div>
      </div>
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
        <div className="space-y-1.5">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-3 w-28" />
        </div>
        <div className="space-y-1.5 text-right">
          <SkeletonBase className="h-5 w-14" />
          <SkeletonBase className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

const LogisticsPage = () => {
  const [ordersAwaitingShipment, setOrdersAwaitingShipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const packagingTips = [
    {
      title: "Use Double Boxing",
      description: "For fragile items, use nested boxes with cushioning.",
      icon: <CubeTransparentIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      title: "Choose the Right Size",
      description: "Avoid oversized boxes to reduce cost and damage risk.",
      icon: <TruckIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      title: "Waterproof Your Items",
      description:
        "Wrap items in plastic before boxing for moisture protection.",
      icon: <ShieldCheckIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      title: "Label Clearly & Securely",
      description:
        "Ensure the label is legible, secure, and has a return address.",
      icon: <TagIcon className="w-5 h-5 text-gray-400" />,
    },
  ];
  const handleSelectAndShip = async (orderId, partner) => {
    try {
      await api.put(`/orders/${orderId}/ship`, {
        partnerName: partner.partnerName,
        estimatedPrice: partner.estimatedPrice,
      });
      fetchLogisticsData();
    } catch (err) {
      setError("Failed to update order. Please try again.");
      console.error("Ship order error:", err);
    }
  };
  const hasUsedCatalog = !!user?.hasUsedMaterialsCatalog;

  const catalogLink = hasUsedCatalog
    ? "/artisan/materials-catalog"
    : "/artisan/raw-materials";

  useEffect(() => {
    const fetchLogisticsData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/logistics");
        setOrdersAwaitingShipment(response.data.ordersAwaitingShipment || []);
      } catch (err) {
        setError(
          "Failed to load logistics information. Please try again later."
        );
        console.error("Fetch logistics error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogisticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 px-6 md:px-8 py-8 md:py-10">
        <div className="flex-grow space-y-12 md:space-y-16">
          <SkeletonHero />
          <div className="space-y-6">
            <SkeletonOrderCard />
            <SkeletonOrderCard />
          </div>
        </div>
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <SkeletonBase className="h-40" /> {}
          <SkeletonBase className="h-40" />{" "}
          {}
          <SkeletonBase className="h-56" /> {}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      <div className="flex-grow lg:w-2/3">
        <AnimatedSection className="mb-8 pt-8 text-center">
          <h1
            className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
            style={{
              background: "linear-gradient(90deg, #FDD835, #FFC107)",
              color: "#f7f8fbff",
            }}
          >
            Logistics Advisor
          </h1>
          <p className="mt-3 text-gray-700 text-sm">
            Get the best shipping recommendations for each of your pending
            orders.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Orders Awaiting Shipment ({ordersAwaitingShipment.length})
            </h2>
            {ordersAwaitingShipment.length > 0 ? (
              ordersAwaitingShipment.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order
                      </h3>
                      <p className="text-sm text-gray-600">
                        To: {order.shippingAddress?.name},{" "}
                        <span className="font-medium">
                          {order.logistics?.destinationCity}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Distance: {order.logistics?.distanceKm} km &bull;
                        Weight: {order.logistics?.packageWeightKg?.toFixed(1)}{" "}
                        kg
                      </p>
                    </div>
                    <a
                      href="#"
                      className="text-xs font-medium text-google-blue hover:underline whitespace-nowrap mt-2 sm:mt-0"
                    >
                      View Order Details
                    </a>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Shipping Recommendations:
                    </h4>
                    <div className="space-y-3">
                      {}
                      {order.logistics?.recommendations?.map((rec) => (
                        <div
                          key={rec.partnerName}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200"
                        >
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {rec.partnerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {rec.reason}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="font-bold text-google-green">
                              ₹{rec.estimatedPrice}
                            </p>
                            <button
                              onClick={() => handleSelectAndShip(order.id, rec)}
                              className="text-xs flex items-center gap-1 bg-google-blue text-white px-2 py-1 rounded-md mt-1 hover:bg-opacity-90 transition-colors"
                            >
                              <SendIcon size={12} />
                              Select & Ship
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
                <ArchiveIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  All Caught Up!
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  You have no orders currently awaiting shipment.
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>

      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
        <AnimatedSection>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheckIcon className="h-6 w-6 text-google-green" />
              <h3 className="text-base font-medium text-gray-800">
                Ethical Supply Chain
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              We manage everything from certified raw material sourcing to our
              proprietary logistics network, ensuring end-to-end quality
              control.
            </p>
            <Link
              to="/artisan/raw-materials"
              className="text-xs font-medium text-google-blue hover:underline flex items-center gap-1"
            >
              Explore Our Process <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <BuildingStorefrontIcon className="h-6 w-6 text-google-blue" />
              <h3 className="text-base font-medium text-gray-800">
                Raw Materials
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {}
              {hasUsedCatalog
                ? "Browse our catalog or view your past material orders."
                : "Learn about our ethical sourcing and browse the catalog."}
            </p>
            <Link
              to={catalogLink}
              className="text-xs font-medium text-google-blue hover:underline flex items-center gap-1"
            >
              {}
              {hasUsedCatalog ? "Go to Marketplace" : "Learn More"}{" "}
              <span>&rarr;</span>
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CubeTransparentIcon className="h-6 w-6 text-gray-500" />
              <h3 className="text-base font-medium text-gray-800">
                Packaging Tips
              </h3>
            </div>
            <div className="space-y-4">
              {packagingTips.map((tip) => (
                <div key={tip.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-gray-400 mt-0.5">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-800">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </aside>
    </div>
  );
};

export default LogisticsPage;
