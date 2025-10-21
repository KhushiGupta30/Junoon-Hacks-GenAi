import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/scrolltotop.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import ArtisanLayout from "./components/layout/ArtisanLayout.jsx";
import AmbassadorLayout from "./components/layout/AmbassadorLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AmbassadorPage from "./pages/ambassador.jsx";
import ArtisanPage from "./pages/artisan.jsx";
import BuyerMarket from "./pages/buyermarket.jsx";
import SellerPage from "./components/SellerPage.jsx";
import CartPage from "./components/cartpage.jsx";
import ProductPage from "./components/ProductPage.jsx";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard.jsx";
import MyProductsPage from "./pages/artisan/MyProductsPage.jsx";
import ProductEditPage from "./pages/artisan/ProductEditPage.jsx";
import ArtisanProfilePage from "./pages/artisan/ArtisanProfilePage.jsx";
import MyOrdersPage from "./pages/artisan/MyOrdersPage.jsx";
import IdeaSubmissionPage from "./pages/artisan/IdeaSubmissionPage.jsx";
import GrantsPage from "./pages/artisan/GrantsPage.jsx";
import AITrendsPage from "./pages/artisan/AITrendsPage.jsx";
import CommunityPage from "./pages/artisan/CommunityPage.jsx";
import LogiPage from "./pages/artisan/LogiPage.jsx";
import AmbassadorDashboard from "./pages/ambassador/Dashboard.jsx";
import MyArtisans from "./pages/ambassador/MyArtisans.jsx";
import CommunityHub from "./pages/ambassador/CommunityHub.jsx";
import Profile from "./pages/ambassador/Profile.jsx";
import FindArtisans from "./pages/ambassador/FindArtisans.jsx";
import DiscussionPage from "./pages/artisan/DiscussionPage.jsx";
import DiscussionThreadPage from "./pages/artisan/DiscussionThreadPage.jsx";
import InvestorLayout from "./components/layout/InvestorLayout.jsx";
import InvestorDashboard from "./pages/investor/InverstorDashboard.jsx";
import BrowseArtisans from "./pages/investor/BrowseArtisans.jsx";
import InvestmentPortfolio from "./pages/investor/InvestmentPortfolio.jsx";

const AppLayout = () => {
  const location = useLocation();
  const hideFor = ["/artisan", "/ambassador","/investor"];
  const shouldHide = hideFor.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHide && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ambassador-page" element={<AmbassadorPage />} />
          <Route path="/artisan-page" element={<ArtisanPage />} />
          <Route path="/buyer" element={<BuyerMarket />} />
          <Route path="/market" element={<BuyerMarket/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/seller/:artisanId" element={<SellerPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          {/* <Route path="/artisan/reviews" element={<ReviewsPage />} /> */}

          <Route
            path="/artisan/*"
            element={
              <ProtectedRoute role="artisan">
                <ArtisanLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ArtisanDashboard />} />
            <Route path="products" element={<MyProductsPage />} />
            <Route path="products/new" element={<ProductEditPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="ideas/new" element={<IdeaSubmissionPage />} />
            <Route path="grant" element={<GrantsPage />} />
            <Route path="trends" element={<AITrendsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="discussions" element={<DiscussionPage />} />
            <Route path="discussions/:id" element={<DiscussionThreadPage />} />
            <Route path="logistics" element={<LogiPage />} />
            <Route path="profile" element={<ArtisanProfilePage />} />
            {/* <Route path="reviews" element={<ReviewsPage />} /> */}
          </Route>

          <Route
            path="/ambassador/*"
            element={
              <ProtectedRoute role="ambassador">
                <AmbassadorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AmbassadorDashboard />} />
            <Route path="artisans" element={<MyArtisans />} />
            <Route path="community" element={<CommunityHub />} />
            <Route path="profile" element={<Profile />} />
            <Route path="find-artisans" element={<FindArtisans />} />
          </Route>
          <Route
            path="/investor/*"
            element={
              <ProtectedRoute roles={["investor"]}>
                <InvestorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<InvestorDashboard />} />
            <Route path="browse-artisans" element={<BrowseArtisans />} />
            <Route path="portfolio" element={<InvestmentPortfolio />} />
            <Route path="seller/:artisanId" element={<SellerPage />} />


          </Route>
        </Routes>
      </main>
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
