import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/scrolltotop';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ArtisanLayout from './components/layout/ArtisanLayout';
import AmbassadorLayout from './components/layout/AmbassadorLayout';
import LandingPage from './pages/LandingPage';
import AmbassadorPage from './pages/ambassador';
import ArtisanPage from './pages/artisan';
import BuyerMarket from './pages/buyermarket';
import SellerPage from './components/SellerPage';
import CartPage from './components/cartpage';
import ProductPage from './components/ProductPage';
import SellerPage from './components/SellerPage';
import ScrollToTop from './components/scrolltotop';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ArtisanLayout from './components/layout/ArtisanLayout.jsx'
import ArtisanDashboardPage from './pages/artisan/ArtisanDashboard.jsx';
import MyProductsPage from './pages/artisan/MyProductsPage.jsx';
import ProductEditPage from './pages/artisan/ProductEditPage.jsx';
import MyOrdersPage from './pages/artisan/MyOrdersPage.jsx';
import IdeaSubmissionPage from './pages/artisan/IdeaSubmissionPage.jsx';
import Aitrendpage from './pages/artisan/AITrendsPage.jsx';
import GrantsPage from './pages/artisan/GrantsPage.jsx';
import LogiPage from './pages/artisan/LogiPage.jsx';
import CommunityPage from './pages/artisan/CommunityPage.jsx';
import AmbassadorDashboardPage from './pages/ambassadordashboard.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/artisan" element={<ArtisanPage />} />
            <Route path="/ambassador" element={<AmbassadorPage />} />
            <Route path="/buyer" element={<BuyerMarketplace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/seller/:artisanId" element={<SellerPage />} />
            <Route 
              element={
                <ProtectedRoute roles={['artisan']}>
                  <ArtisanLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/artisan/dashboard" element={<ArtisanDashboardPage />} />
              <Route path="/artisan/products" element={<MyProductsPage />} />
              <Route path="/artisan/products/new" element={<ProductEditPage />} />
              <Route path="/artisan/products/edit/:productId" element={<ProductEditPage />} />
              <Route path="/artisan/orders" element={<MyOrdersPage />} />
              <Route path="/artisan/trends" element={<Aitrendpage/>} />
              <Route path="/artisan/grant" element={<GrantsPage/>} />
              <Route path="/artisan/logistics" element={<LogiPage/>} />
              <Route path="/artisan/community" element={<CommunityPage/>} />
              <Route path="/artisan/ideas/new" element={<IdeaSubmissionPage />} />
            </Route>
            <Route path="/ambassador/dashboard" element={<AmbassadorDashboardPage />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;