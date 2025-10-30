import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import AnimatedSection from "../../components/ui/AnimatedSection";
import {
  BriefcaseIcon,
  BuildingIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
  TrendingUpIcon,
  RefreshIcon,
} from "../../components/common/Icons";

const SkeletonBase = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);
const SkeletonSidebarCard = () => <SkeletonBase className="h-44 md:h-48" />;
const SkeletonTipCard = () => <SkeletonBase className="h-24 md:h-28" />;
const SkeletonInvestorCard = () => <SkeletonBase className="h-64" />;
const SkeletonSchemeCard = () => <SkeletonBase className="h-32" />;
const SkeletonSectionHeader = () => <SkeletonBase className="h-8 w-1/2 mb-4" />;

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
      isActive
        ? "text-google-blue font-medium"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 rounded-t-md"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {title}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>
    )}
  </button>
);

const GrantsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportError, setReportError] = useState("");

  const [schemesData, setSchemesData] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [schemesError, setSchemesError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("plan");

  useEffect(() => {
    const generateReport = async () => {
      setReportLoading(true);
      setReportError("");
      try {
        const response = await api.post("/ai/funding-report");
        setReportData(response.data);
      } catch (err) {
        setReportError(
          "Could not generate your personalized funding report. Please try again later."
        );
        console.error(err);
      } finally {
        setReportLoading(false);
      }
    };
    generateReport();
  }, []);

  const fetchSchemes = async (forceRefresh = false) => {
    if (activeTab === "schemes" && (forceRefresh || schemesData.length === 0)) {
      setSchemesLoading(true);
      setSchemesError("");
      if (forceRefresh) setIsRefreshing(true);

      try {
        let response;
        if (forceRefresh) {
          response = await api.post("/schemes/refresh");
        } else {
          response = await api.get("/schemes");
        }
        setSchemesData(response.data);
      } catch (err) {
        setSchemesError(
          "Could not fetch government schemes. Please try again later."
        );
        console.error(err);
      } finally {
        setSchemesLoading(false);
        if (forceRefresh) setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchSchemes(false);
  }, [activeTab]);

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "bg-google-green text-white";
    if (score >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-google-blue";
  };

  const getReadinessColor = (score) => {
    if (score >= 75) return "text-google-green";
    if (score >= 50) return "text-yellow-500";
    return "text-google-red";
  };

  if (reportLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        {}
        <div className="flex-grow space-y-8 md:space-y-10">
          <SkeletonBase className="h-10 w-3/4 mb-4" /> {}
          <SkeletonBase className="h-10 w-full mb-6" /> {}
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonTipCard />
            <SkeletonTipCard />
            <SkeletonTipCard />
          </div>
        </div>
        {}
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <SkeletonSidebarCard />
        </div>
      </div>
    );
  }

  if (reportError || !reportData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
        <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {reportError || "Could not load your funding report."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      {}
      <div className="flex-grow lg:w-2/3">
        {}
        <AnimatedSection className="mb-8 pt-8 text-center">
          <h1
            className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
            style={{
              background: "linear-gradient(90deg, #FDD835, #FFC107)",
              color: "#FFFFFF",
            }}
          >
            AI Funding Advisor
          </h1>
          <p className="mt-3 text-gray-700 text-sm">
            Personalized opportunities to fuel your creative business.
          </p>
        </AnimatedSection>

        {}
        <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8 pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            <TabButton
              title="Action Plan"
              isActive={activeTab === "plan"}
              onClick={() => setActiveTab("plan")}
            />
            <TabButton
              title="Matched Investors"
              isActive={activeTab === "investors"}
              onClick={() => setActiveTab("investors")}
            />
            <TabButton
              title="Recommended Schemes"
              isActive={activeTab === "schemes"}
              onClick={() => setActiveTab("schemes")}
            />
          </div>
        </div>

        {}
        <AnimatedSection>
          {}
          {activeTab === "plan" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2 px-1">
                <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-medium text-gray-800">
                  Your AI-Generated Action Plan
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-6 px-1">
                Follow these steps to improve your funding readiness.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {" "}
                {reportData.applicationTips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 bg-yellow-100/70 rounded-full flex items-center justify-center">
                        <LightBulbIcon className="h-4 w-4 text-yellow-600" />
                      </div>
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

          {}
          {activeTab === "investors" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 px-1">
                <BriefcaseIcon className="h-6 w-6 text-google-blue" />
                <h2 className="text-xl font-medium text-gray-800">
                  AI-Matched Investors
                </h2>
              </div>
              {reportData.matchedInvestors &&
              reportData.matchedInvestors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportData.matchedInvestors.map((investor) => (
                    <div
                      key={investor.id}
                      className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={investor.avatar}
                            alt={investor.name}
                            className="h-10 w-10 rounded-full border border-gray-100"
                          />{" "}
                          <div>
                            <h3 className="font-semibold text-sm text-gray-800">
                              {investor.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {investor.type}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${getMatchScoreColor(
                            investor.matchScore
                          )}`}
                        >
                          {investor.matchScore}% Match
                        </div>
                      </div>
                      <p className="text-xs italic text-gray-500 mt-1 mb-3 p-2 bg-gray-50/70 rounded border border-gray-100">
                        "{investor.reasonForMatch}"
                      </p>
                      <div className="mt-auto border-t border-gray-100 pt-3 text-xs space-y-1.5 flex-grow">
                        <p>
                          <strong className="font-medium text-gray-600">
                            Focus:
                          </strong>{" "}
                          <span className="text-gray-500">
                            {investor.focus}
                          </span>
                        </p>
                        <p>
                          <strong className="font-medium text-gray-600">
                            Range:
                          </strong>{" "}
                          <span className="text-gray-500">
                            {investor.investmentRange.min} -{" "}
                            {investor.investmentRange.max}
                          </span>
                        </p>
                      </div>
                      <button className="mt-4 w-full bg-google-blue text-white font-medium py-1.5 rounded-md hover:bg-opacity-90 transition-colors text-xs">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center min-h-[150px]">
                  <BriefcaseIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="font-medium text-sm text-gray-700">
                    No Matched Investors Found
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 px-4">
                    Our AI couldn't find investors matching your profile right
                    now. We'll notify you of new opportunities.
                  </p>
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === "schemes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 mb-6 px-1">
                <div className="flex items-center gap-3">
                  <BuildingIcon className="h-6 w-6 text-google-red opacity-80" />
                  <h2 className="text-xl font-medium text-gray-800">
                    Recommended Schemes
                  </h2>
                </div>
                {}
                <button
                  onClick={() => fetchSchemes(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-xs text-google-blue font-medium px-3 py-1.5 rounded-md bg-google-blue/10 hover:bg-google-blue/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  <RefreshIcon
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {}
              {schemesLoading && (
                <div className="space-y-4">
                  <SkeletonSchemeCard />
                  <SkeletonSchemeCard />
                  <SkeletonSchemeCard />
                </div>
              )}

              {!schemesLoading && schemesError && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center flex flex-col items-center justify-center min-h-[150px]">
                  <ExclamationCircleIcon className="h-8 w-8 text-red-400 mb-2" />
                  <h3 className="font-medium text-sm text-red-700">
                    Error Fetching Schemes
                  </h3>
                  <p className="text-xs text-red-600 mt-1 px-4">
                    {schemesError}
                  </p>
                </div>
              )}

              {!schemesLoading && !schemesError && schemesData.length === 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center min-h-[150px]">
                  <BuildingIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="font-medium text-sm text-gray-700">
                    No Schemes Found
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 px-4">
                    We couldn't find any relevant government schemes for your
                    location. Try refreshing or check back later.
                  </p>
                </div>
              )}

              {!schemesLoading && !schemesError && schemesData.length > 0 && (
                <div className="space-y-4">
                  {}
                  {schemesData.map((scheme, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          {}
                          <h3 className="text-sm font-semibold text-gray-800">
                            {scheme.title}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                            {scheme.source}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            {scheme.snippet}
                          </p>
                        </div>
                        {}
                        <a
                          href={scheme.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-google-blue/10 text-google-blue font-medium px-4 py-1.5 rounded-md text-xs hover:bg-google-blue/20 transition-colors whitespace-nowrap self-start sm:self-center mt-2 sm:mt-0"
                        >
                          Learn More
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AnimatedSection>
      </div>

      {}
      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4">
        {}
        <AnimatedSection>
          {}
          <div className="bg-green-50/60 p-6 rounded-xl border border-green-200/80 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUpIcon className="h-5 w-5 text-google-green" />
              <h3 className="text-sm font-medium text-green-900">
                Funding Readiness
              </h3>
            </div>
            <p
              className={`text-5xl font-bold ${getReadinessColor(
                reportData.fundingReadiness.score
              )}`}
            >
              {reportData.fundingReadiness.score}
              <span className="text-3xl">%</span>
            </p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {reportData.fundingReadiness.summary}
            </p>
          </div>
        </AnimatedSection>

        {}
      </aside>
    </div>
  );
};

export default GrantsPage;
