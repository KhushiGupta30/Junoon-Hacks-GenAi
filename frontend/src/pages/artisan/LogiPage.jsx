import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
    TruckIcon,
    GlobeAltIcon,
    CubeTransparentIcon,
    SparklesIcon,
    CheckIcon,
    ShieldCheckIcon,
    TagIcon
} from '../../components/common/Icons';

const SkeletonBase = ({ className = "" }) => <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>;
const SkeletonHero = () => <SkeletonBase className="h-40 md:h-48" />;
const SkeletonSidebarCard = () => <SkeletonBase className="h-48" />;
const SkeletonPartnerCard = () => <SkeletonBase className="h-40" />;
const SkeletonSectionHeader = () => <SkeletonBase className="h-10 w-1/2 mb-4" />;
const SkeletonTipCard = () => <SkeletonBase className="h-24" />;

const TabButton = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
            isActive ? 'text-google-blue font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-t-md'
        }`}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>}
    </button>
);

const LogisticsPage = () => {
    const [logisticsData, setLogisticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('domestic');

    const packagingTips = [
        { title: "Use Double Boxing", description: "For fragile items, use nested boxes with cushioning.", icon: <CubeTransparentIcon className="w-5 h-5 text-gray-400" /> },
        { title: "Choose the Right Size", description: "Avoid oversized boxes to reduce cost and damage risk.", icon: <TruckIcon className="w-5 h-5 text-gray-400" /> },
        { title: "Waterproof Your Items", description: "Wrap items in plastic before boxing for moisture protection.", icon: <ShieldCheckIcon className="w-5 h-5 text-gray-400" /> },
        { title: "Label Clearly & Securely", description: "Ensure the label is legible, secure, and has a return address.", icon: <TagIcon className="w-5 h-5 text-gray-400" /> },
    ];

    useEffect(() => {
        const fetchLogisticsData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/logistics');
                setLogisticsData(response.data);
            } catch (err) {
                setError('Failed to load logistics information. Please try again later.');
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
          <SkeletonSectionHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonPartnerCard />
            <SkeletonPartnerCard />
          </div>
          <SkeletonSectionHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonPartnerCard />
            <SkeletonPartnerCard />
          </div>
          <SkeletonSectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonTipCard />
            <SkeletonTipCard />
            <SkeletonTipCard />
            <SkeletonTipCard />
          </div>
        </div>
        <div className="lg:w-80 flex-shrink-0 space-y-8">
          <SkeletonSidebarCard />
          <SkeletonSidebarCard />
        </div>
      </div>
    );
  }

  if (error || !logisticsData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "Could not load logistics data."}
        </p>
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
            Logistics Hub
          </h1>
          <p className="mt-3 text-gray-700 text-sm">
            Manage shipping partners, get suggestions, and find packaging tips.
          </p>
        </AnimatedSection>

        <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            <TabButton
              title="Domestic Partners"
              isActive={activeTab === "domestic"}
              onClick={() => setActiveTab("domestic")}
            />
            <TabButton
              title="International Partners"
              isActive={activeTab === "international"}
              onClick={() => setActiveTab("international")}
            />
            <TabButton
              title="Packaging Tips"
              isActive={activeTab === "tips"}
              onClick={() => setActiveTab("tips")}
            />
          </div>
        </div>

        <AnimatedSection>
          {activeTab === "domestic" && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TruckIcon className="h-7 w-7 text-google-blue" />
                <h2 className="text-xl font-medium text-gray-800">
                  Available Domestic Partners
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logisticsData.domesticPartners.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="h-7 object-contain self-start mb-4"
                    />
                    <p className="text-sm text-gray-600 flex-grow mb-3">
                      {p.summary}
                    </p>
                    <div className="mt-auto border-t border-gray-100 pt-3 space-y-1.5">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Strengths:
                      </p>
                      {p.strengths.map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-1.5 text-xs text-gray-700"
                        >
                          <CheckIcon className="w-3.5 h-3.5 text-google-green flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "international" && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <GlobeAltIcon className="h-7 w-7 text-google-green" />
                <h2 className="text-xl font-medium text-gray-800">
                  Available International Partners
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logisticsData.internationalPartners.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="h-7 object-contain self-start mb-4"
                    />
                    <p className="text-sm text-gray-600 flex-grow mb-3">
                      {p.summary}
                    </p>
                    <div className="mt-auto border-t border-gray-100 pt-3 space-y-1.5">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Strengths:
                      </p>
                      {p.strengths.map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-1.5 text-xs text-gray-700"
                        >
                          <CheckIcon className="w-3.5 h-3.5 text-google-green flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "tips" && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <CubeTransparentIcon className="h-7 w-7 text-gray-500" />
                <h2 className="text-xl font-medium text-gray-800">
                  Essential Packaging Tips
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {packagingTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="bg-gray-50 border border-gray-200 p-5 rounded-lg flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 text-gray-400 mt-0.5">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>
      </div>

      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
        <AnimatedSection>
          <div className="bg-green-50/50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheckIcon className="h-6 w-6 text-google-green" />
              <h3 className="text-base font-medium text-gray-800">
                Ethical Supply Chain
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              From certified raw materials to global logistics, we ensure
              end-to-end quality and ethical standards.
            </p>
            <a
              href="#"
              className="mt-3 inline-block text-xs font-medium text-google-green hover:underline"
            >
              Learn more
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <SparklesIcon className="h-6 w-6 text-google-blue" />
              <h3 className="text-base font-medium text-gray-800">
                AI Suggestion
              </h3>
            </div>
            <p className="text-gray-500 italic mb-3 text-xs">
              {logisticsData.bestFitSuggestion.scenario}
            </p>
            <div className="mt-3 flex items-start gap-3">
              <img
                src={logisticsData.bestFitSuggestion.logoUrl}
                alt="Partner Logo"
                className="h-7 object-contain flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-google-blue">
                  {logisticsData.bestFitSuggestion.partnerName}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {logisticsData.bestFitSuggestion.reason}
                </p>
                <p className="text-xs font-semibold text-google-green mt-1">
                  {logisticsData.bestFitSuggestion.estimatedCost}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </aside>
    </div>
  );
};

export default LogisticsPage;