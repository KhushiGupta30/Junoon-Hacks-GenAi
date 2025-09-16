import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import LandingPage from './pages/landing';
import ArtisanPage from './pages/artisan';
import AmbassadorPage from './pages/ambassador';
import BuyerMarketplace from './pages/buyermarket'; 
import CartPage from './components/cartpage';
import ProductPage from './components/ProductPage';
import SellerPage from './components/SellerPage';
import ArtisanDashboardPage from './pages/artisandashboard';
import ScrollToTop from './components/scrolltotop';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MyProductsPage from './pages/MyProductsPage.jsx'; // Import the new page

function App() {

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/artisan" element={<ArtisanPage />} />
            <Route path="/ambassador" element={<AmbassadorPage />} />
            <Route path="/buyer" element={<BuyerMarketplace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/seller/:artisanId" element={<SellerPage />} />

            {/* Protected Artisan Routes */}
            <Route 
              path="/artisan/dashboard" 
              element={
                <ProtectedRoute roles={['artisan']}>
                  <ArtisanDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/artisan/products" 
              element={
                <ProtectedRoute roles={['artisan']}>
                  <MyProductsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App