// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- Core Components & Context ---
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/scrolltotop';

// --- Layouts ---
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ArtisanLayout from './components/layout/ArtisanLayout';
import AmbassadorLayout from './components/layout/AmbassadorLayout'; // Correctly imported

// --- Public Pages ---
import LandingPage from './pages/LandingPage';
import AmbassadorPage from './pages/ambassador';
import ArtisanPage from './pages/artisan';
import BuyerMarket from './pages/buyermarket';
import SellerPage from './components/SellerPage';
import CartPage from './components/cartpage';
import ProductPage from './components/ProductPage';

// --- Artisan Pages ---
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import MyProductsPage from './pages/artisan/MyProductsPage';
import ProductEditPage from './pages/artisan/ProductEditPage';
import MyOrdersPage from './pages/artisan/MyOrdersPage';
import IdeaSubmissionPage from './pages/artisan/IdeaSubmissionPage';
import GrantsPage from './pages/artisan/GrantsPage';
import AITrendsPage from './pages/artisan/AITrendsPage';
import CommunityPage from './pages/artisan/CommunityPage';
import LogiPage from './pages/artisan/LogiPage';

// --- Ambassador Pages ---
import AmbassadorDashboard from './pages/ambassador/Dashboard';
import MyArtisans from './pages/ambassador/MyArtisans';
import CommunityHub from './pages/ambassador/CommunityHub';
import Profile from './pages/ambassador/Profile';


// Layout manager to show/hide Header and Footer
const AppLayout = () => {
  const location = useLocation();
  const hideFor = ['/artisan', '/ambassador'];
  const shouldHide = hideFor.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHide && <Header />}
      <main>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/ambassador-page" element={<AmbassadorPage />} />
          <Route path="/artisan-page" element={<ArtisanPage />} />
          <Route path="/buyer" element={<BuyerMarket />} />
          <Route path="/seller/:sellerId" element={<SellerPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<ProductPage />} />

          {/* --- Artisan Routes --- */}
          <Route path="/artisan/*" element={
            <ProtectedRoute role="artisan">
              <ArtisanLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<ArtisanDashboard />} />
            <Route path="products" element={<MyProductsPage />} />
            <Route path="products/edit/:id" element={<ProductEditPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="ideas" element={<IdeaSubmissionPage />} />
            <Route path="grants" element={<GrantsPage />} />
            <Route path="trends" element={<AITrendsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="logistics" element={<LogiPage />} />
          </Route>

          {/* --- Ambassador Routes (FIXED) --- */}
          <Route path="/ambassador/*" element={
            <ProtectedRoute role="ambassador">
              <AmbassadorLayout />
            </ProtectedRoute>
          }>
            {/* These nested routes will render inside AmbassadorLayout's <Outlet /> */}
            <Route path="dashboard" element={<AmbassadorDashboard />} />
            <Route path="artisans" element={<MyArtisans />} />
            <Route path="community" element={<CommunityHub />} />
            <Route path="profile" element={<Profile />} />
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