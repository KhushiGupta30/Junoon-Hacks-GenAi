import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from 'framer-motion'; // <-- 1. IMPORT
import AnimatedPage from './components/ui/AnimatedPage'; // <-- 2. IMPORT
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
import BuyerMarket from "./pages/buyermarket/buyermarket.jsx";
import SellerPage from "./pages/common/SellerPage.jsx";
import CartPage from "./pages/buyermarket/cartpage.jsx";
import ProductPage from "./pages/common/ProductPage.jsx";
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
import InvestorProfile from "./pages/investor/InvestorProfile.jsx";
import ReviewsPage from "./pages/artisan/ReviewsPage.jsx";
import RawMaterialsPage from "./pages/artisan/RawMaterialsPage.jsx";
import MaterialsCatalogPage from "./pages/artisan/MaterialsCatalogPage.jsx";
import BuyerLayout from "./components/layout/BuyerLayout.jsx";

const AppLayout = () => {
  const location = useLocation();
  const hideFor = ["/artisan", "/ambassador","/investor","/buyer"];
  const shouldHide = hideFor.some((path) => location.pathname.startsWith(path));

  
  return (
    <>
      {!shouldHide && <Header />}   
      <main>
        {/* --- 3. WRAP YOUR ROUTES --- */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}> {/* 4. ADD LOCATION & KEY */}
            
            {/* --- 5. WRAP ALL PAGE ELEMENTS --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/ambassador-page" element={<AnimatedPage><AmbassadorPage /></AnimatedPage>} />
            <Route path="/artisan-page" element={<AnimatedPage><ArtisanPage /></AnimatedPage>} />
            
           
            <Route path="/seller/:artisanId" element={<AnimatedPage><SellerPage /></AnimatedPage>} />
            <Route path="/product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />

            <Route
              path="/artisan/*"
              element={
                <ProtectedRoute role="artisan">
                  <ArtisanLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AnimatedPage><ArtisanDashboard /></AnimatedPage>} />
              <Route path="products" element={<AnimatedPage><MyProductsPage /></AnimatedPage>} />
              <Route path="products/new" element={<AnimatedPage><ProductEditPage /></AnimatedPage>} />
              <Route path="orders" element={<AnimatedPage><MyOrdersPage /></AnimatedPage>} />
              <Route path="ideas/new" element={<AnimatedPage><IdeaSubmissionPage /></AnimatedPage>} />
              <Route path="grant" element={<AnimatedPage><GrantsPage /></AnimatedPage>} />
              <Route path="trends" element={<AnimatedPage><AITrendsPage /></AnimatedPage>} />
              <Route path="community" element={<AnimatedPage><CommunityPage /></AnimatedPage>} />
              <Route path="discussions" element={<AnimatedPage><DiscussionPage /></AnimatedPage>} />
              <Route path="discussions/:id" element={<AnimatedPage><DiscussionThreadPage /></AnimatedPage>} />
              <Route path="logistics" element={<AnimatedPage><LogiPage /></AnimatedPage>} />
              <Route path="profile" element={<AnimatedPage><ArtisanProfilePage /></AnimatedPage>} />
              <Route path="reviews" element={<AnimatedPage><ReviewsPage /></AnimatedPage>} />
              <Route path="raw-materials" element={<AnimatedPage><RawMaterialsPage /></AnimatedPage>} />
              <Route path="materials-catalog" element={<AnimatedPage><MaterialsCatalogPage /></AnimatedPage>} />
            </Route>

             <Route
              path="/buyer/*"
              element={
                <ProtectedRoute role="buyer">
                  <BuyerLayout />
                </ProtectedRoute>
              }
            >
              
              <Route path="market" element={<AnimatedPage><BuyerMarket/></AnimatedPage>} />
               <Route path="cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
              <Route path="products" element={<AnimatedPage><MyProductsPage /></AnimatedPage>} />
              <Route path="product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />
              <Route path="seller/:artisanId" element={<AnimatedPage><SellerPage /></AnimatedPage>} />
             
              
            </Route>

            <Route
              path="/ambassador/*"
              element={
                <ProtectedRoute role="ambassador">
                  <AmbassadorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AnimatedPage><AmbassadorDashboard /></AnimatedPage>} />
              <Route path="artisans" element={<AnimatedPage><MyArtisans /></AnimatedPage>} />
              <Route path="community" element={<AnimatedPage><CommunityHub /></AnimatedPage>} />
              <Route path="profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
              <Route path="find-artisans" element={<AnimatedPage><FindArtisans /></AnimatedPage>} />
            </Route>
            <Route
              path="/investor/*"
              element={
                <ProtectedRoute roles={["investor"]}>
                  <InvestorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AnimatedPage><InvestorDashboard /></AnimatedPage>} />
              <Route path="browse-artisans" element={<AnimatedPage><BrowseArtisans /></AnimatedPage>} />
              <Route path="portfolio" element={<AnimatedPage><InvestmentPortfolio /></AnimatedPage>} />
              <Route path="seller/:artisanId" element={<AnimatedPage><SellerPage /></AnimatedPage>} />
              <Route path ="profile" element={<AnimatedPage><InvestorProfile/></AnimatedPage>}/>
              <Route path="product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />
            </Route>
          </Routes>
        </AnimatePresence>
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
