import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import AnimatedSection from "../../components/ui/AnimatedSection";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  StarIcon,
  ExclamationCircleIcon,
  ReplyIcon,
  CollectionIcon,
  ChatAltIcon,
  CalendarIcon,
  TagIcon,
  ArchiveIcon,
} from "../../components/common/Icons";

const SkeletonBase = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);
const SkeletonStatCard = () => <SkeletonBase className="h-28 rounded-xl" />;
const SkeletonReviewCard = () => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 animate-pulse space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <SkeletonBase className="h-10 w-10 rounded-md" />
        <div className="space-y-1.5">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-3 w-32" />
        </div>
      </div>
      <SkeletonBase className="h-4 w-16" />
    </div>
    <SkeletonBase className="h-3 w-full" />
    <SkeletonBase className="h-3 w-2/3" />
    <div className="flex justify-end">
      <SkeletonBase className="h-8 w-20 rounded-md" />
    </div>
  </div>
);

const StarRating = ({ rating, size = "h-4 w-4" }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`${size} ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, onReplySubmit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      await onReplySubmit(review.id, replyText);
      setShowReplyForm(false);
      setReplyText("");
    } catch (error) {
      console.error("Failed to submit reply", error);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              review.productImage ||
              "https://placehold.co/40x40/E8F0FE/4285F4?text=K"
            }
            alt={review.productName}
            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/40x40/E8F0FE/4285F4?text=K")
            }
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">
              {review.productName}
            </p>
            <p className="text-xs text-gray-500">by {review.userName}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end">
          <StarRating rating={review.rating} />
          <p className="text-xs text-gray-400 mt-1">
            {new Date(review.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3 pl-13">{review.comment}</p>

      <div className="mt-4 pl-13">
        {review.reply ? (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-xs font-semibold text-gray-700">Your reply:</p>
            <p className="text-xs text-gray-600 mt-1">{review.reply.text}</p>
          </div>
        ) : showReplyForm ? (
          <form onSubmit={handleSubmitReply} className="space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your public reply..."
              rows="2"
              className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-google-blue focus:border-google-blue"
            />
            <div className="flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isReplying}
                className="px-3 py-1 text-xs font-bold text-white bg-google-blue rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                {isReplying ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-google-blue bg-blue-50/70 hover:bg-blue-100 rounded-md transition-colors"
          >
            <ReplyIcon className="w-3.5 h-3.5" /> Reply
          </button>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ title, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors relative whitespace-nowrap ${
      isActive
        ? "text-google-blue font-medium"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {title}
    <span
      className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
        isActive
          ? "bg-google-blue/10 text-google-blue"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {count}
    </span>
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>
    )}
  </button>
);

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  const fetchPageData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");
    try {
      const [reviewsResponse, productsResponse] = await Promise.all([
        api.get(`/reviews/artisan/${user.id}`),
        api.get(`/products/artisan/${user.id}`),
      ]);

      setReviews(
        Array.isArray(reviewsResponse.data) ? reviewsResponse.data : []
      );
      setProducts(
        Array.isArray(productsResponse.data) ? productsResponse.data : []
      );
    } catch (err) {
      setError("Failed to fetch page data. Please try again.");
      console.error(err);
      setReviews([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const { summary, filteredReviews } = useMemo(() => {
    let dateFiltered = [...reviews];
    if (selectedDateRange !== "all") {
      const daysAgo = parseInt(selectedDateRange, 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      dateFiltered = reviews.filter((r) => new Date(r.date) >= cutoffDate);
    }

    let productFiltered = [...dateFiltered];
    if (selectedProduct !== "all") {
      productFiltered = dateFiltered.filter(
        (r) => r.productId === selectedProduct
      );
    }

    const total = productFiltered.length;
    const needsReply = productFiltered.filter((r) => !r.reply).length;
    const avgRating =
      total > 0
        ? (
            productFiltered.reduce((sum, r) => sum + r.rating, 0) / total
          ).toFixed(1)
        : "0.0";

    let tabFiltered =
      activeTab === "needsReply"
        ? productFiltered.filter((r) => !r.reply)
        : productFiltered;

    return {
      summary: { total, needsReply, avgRating },
      filteredReviews: tabFiltered,
    };
  }, [reviews, activeTab, selectedProduct, selectedDateRange]);

  const handleReplySubmit = async (reviewId, replyText) => {
    const originalReviews = [...reviews];

    const newReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          reply: { text: replyText, date: new Date().toISOString() },
        };
      }
      return r;
    });
    setReviews(newReviews);

    try {
      await api.put(`/reviews/${reviewId}/reply`, { text: replyText });
      toast.success("Reply posted successfully!");
    } catch (error) {
      setReviews(originalReviews);
      console.error("Failed to post reply:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to post reply. Please try again."
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
        <div className="flex-grow space-y-8 md:space-y-10">
          <SkeletonBase className="h-10 w-1/3 mb-4" /> {/* Title */}
          <SkeletonBase className="h-10 w-full mb-8" />
          <div className="flex gap-4">
            <SkeletonBase className="h-10 w-1/2" />
            <SkeletonBase className="h-10 w-1/2" />
          </div>
          <div className="space-y-4">
            {" "}
            <SkeletonReviewCard /> <SkeletonReviewCard />{" "}
          </div>
        </div>
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <SkeletonStatCard /> <SkeletonStatCard /> <SkeletonStatCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] px-6 text-center bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]">
        <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-6">{error}</p>
        <button
          onClick={fetchPageData}
          className="inline-flex items-center px-4 py-2 bg-google-blue text-white rounded-md text-sm hover:brightness-95"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 md:px-8 py-8 md:py-10 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
      <div className="flex-grow lg:w-2/3">
        <AnimatedSection className="mb-6 md:mb-8 text-center pt-8">
          <h1
            className="inline-block text-3xl font-semibold px-6 py-3 rounded-xl shadow-md"
            style={{
              background: "linear-gradient(90deg, #699aeaff, #4285F4)",
              color: "#FFFFFF",
            }}
          >
            Product Reviews
          </h1>
          <p className="mt-3 text-gray-700 text-sm">
            Manage feedback from your customers.
          </p>
        </AnimatedSection>

        {/* --- Tab Navigation --- */}
        <div className="border-b border-gray-200 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8">
          <div className="flex">
            <TabButton
              title="All Reviews"
              isActive={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              count={summary.total}
            />
            <TabButton
              title="Needs Reply"
              isActive={activeTab === "needsReply"}
              onClick={() => setActiveTab("needsReply")}
              count={summary.needsReply}
            />
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-8 mb-6">
          {/* Product Filter */}
          <div className="flex-1">
            <label
              htmlFor="productFilter"
              className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5"
            >
              <TagIcon className="w-4 h-4" /> Filter by Product
            </label>
            <select
              id="productFilter"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-google-blue focus:border-google-blue"
            >
              <option value="all">All Products</option>
              {/* Use product._id and product.name from fetched data */}
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          {/* Date Filter */}
          <div className="flex-1">
            <label
              htmlFor="dateFilter"
              className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5"
            >
              <CalendarIcon className="w-4 h-4" /> Filter by Date
            </label>
            <select
              id="dateFilter"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-google-blue focus:border-google-blue"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <AnimatedSection key={review.id}>
                <ReviewCard review={review} onReplySubmit={handleReplySubmit} />
              </AnimatedSection>
            ))
          ) : (
            <AnimatedSection>
              <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                  <ArchiveIcon className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-medium text-gray-700">
                  No reviews match your filters
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                  {activeTab === "needsReply"
                    ? "You've replied to all reviews in this group."
                    : "Try adjusting your product or date filters."}
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* --- Right Sidebar (Review Stats) --- */}
      <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-24 self-start mt-4 lg:mt-0">
        <AnimatedSection>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <h3 className="text-base font-medium text-gray-800">
                Average Rating
              </h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {summary.avgRating}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on {summary.total} selected review(s).
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <CollectionIcon className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-medium text-gray-800">
                Total Selected Reviews
              </h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{summary.total}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div
            className={`p-5 rounded-xl border ${
              summary.needsReply > 0
                ? "bg-yellow-50/60 border-yellow-200/80"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <ChatAltIcon
                className={`w-5 h-5 ${
                  summary.needsReply > 0 ? "text-yellow-600" : "text-gray-500"
                }`}
              />
              <h3
                className={`text-base font-medium ${
                  summary.needsReply > 0 ? "text-yellow-900" : "text-gray-800"
                }`}
              >
                Needs Reply
              </h3>
            </div>
            <p
              className={`text-4xl font-bold ${
                summary.needsReply > 0 ? "text-yellow-700" : "text-gray-800"
              }`}
            >
              {summary.needsReply}
            </p>
          </div>
        </AnimatedSection>
      </aside>
    </div>
  );
};

export default ReviewsPage;
