import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import LandingPage from './pages/LandingPage';
import ArtisanPage from './pages/artisan';
import AmbassadorPage from './pages/ambassador';
import BuyerMarketplace from './pages/buyermarket'; 
import CartPage from './components/cartpage';
import ProductPage from './components/ProductPage';
import SellerPage from './components/SellerPage';
import ScrollToTop from './components/scrolltotop';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- NEW: Import your Layout ---
import ArtisanLayout from './components/layout/ArtisanLayout.jsx'// Make sure this path is correct

// --- Your Artisan Pages ---
import ArtisanDashboardPage from './pages/artisan/artisandashboard';
import MyProductsPage from './pages/artisan/MyProductsPage.jsx';
import ProductEditPage from './pages/artisan/ProductEditPage.jsx';
import MyOrdersPage from './pages/artisan/MyOrdersPage.jsx';
import IdeaSubmissionPage from './pages/artisan/IdeaSubmissionPage.jsx';
import Aitrendpage from './pages/artisan/AITrendsPage.jsx';
import GrantsPage from './pages/artisan/GrantsPage.jsx';
import LogiPage from './pages/artisan/LogiPage.jsx';
import CommunityPage from './pages/artisan/CommunityPage.jsx';

// --- Your Ambassador Page (Unchanged) ---
import AmbassadorDashboardPage from './pages/ambassadordashboard.jsx';

function App() {

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* --- Public & General Routes (Unchanged) --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/artisan" element={<ArtisanPage />} />
            <Route path="/ambassador" element={<AmbassadorPage />} />
            <Route path="/buyer" element={<BuyerMarketplace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/seller/:artisanId" element={<SellerPage />} />

            {/* --- REFACTORED ARTISAN HUB ROUTES ---
              This parent <Route> is "pathless". It provides a shared UI layout
              (ArtisanLayout) for all its children. We apply the ProtectedRoute
              ONCE to this parent.
            */}
            <Route 
              element={
                <ProtectedRoute roles={['artisan']}>
                  <ArtisanLayout />
                </ProtectedRoute>
              }
            >
              {/* These child routes will now render inside the <ArtisanLayout>'s <Outlet />
                Notice the <ProtectedRoute> wrapper is removed from each one.
              */}
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

            {/* --- Ambassador Route (Unchanged as requested) --- */}
            <Route path="/ambassador/dashboard" element={<AmbassadorDashboardPage />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;