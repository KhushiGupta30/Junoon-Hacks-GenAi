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
import MyProductsPage from './pages/MyProductsPage.jsx';
import ProductEditPage from './pages/ProductEditPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import IdeaSubmissionPage from './pages/IdeaSubmissionPage.jsx'; // Import the new page
import Aitrendpage from './pages/AITrendsPage.jsx';
import GrantsPage from './pages/GrantsPage.jsx';
import LogiPage from './pages/LogiPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import AmbassadorDashboardPage from './pages/ambassadordashboard.jsx';

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
            <Route path="/artisan/dashboard" element={ <ProtectedRoute roles={['artisan']}> <ArtisanDashboardPage /> </ProtectedRoute> } />
            <Route path="/artisan/products" element={ <ProtectedRoute roles={['artisan']}> <MyProductsPage /> </ProtectedRoute> } />
            <Route path="/artisan/products/new" element={ <ProtectedRoute roles={['artisan']}> <ProductEditPage /> </ProtectedRoute> } />
            <Route path="/artisan/products/edit/:productId" element={ <ProtectedRoute roles={['artisan']}> <ProductEditPage /> </ProtectedRoute> } />
            <Route path="/artisan/orders" element={ <ProtectedRoute roles={['artisan']}> <MyOrdersPage /> </ProtectedRoute> } />
            <Route path="artisan/trends" element={ <ProtectedRoute roles={['artisan']}><Aitrendpage/></ProtectedRoute>} />
            <Route path="artisan/grant" element={ <ProtectedRoute roles={['artisan']}><GrantsPage/></ProtectedRoute>} />
            <Route path="artisan/logistics" element={ <ProtectedRoute roles={['artisan']}><LogiPage/></ProtectedRoute>} />
            <Route path="artisan/community" element={ <ProtectedRoute roles={['artisan']}><CommunityPage/></ProtectedRoute>} />
            <Route path="/ambassador/dashboard" element={<AmbassadorDashboardPage />} />
            {/* --- NEW ROUTE --- */}
            <Route path="/artisan/ideas/new" element={ <ProtectedRoute roles={['artisan']}> <IdeaSubmissionPage /> </ProtectedRoute> } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App