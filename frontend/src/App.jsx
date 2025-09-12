import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Make sure the name matches */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/artisan" element={<ArtisanPage />} />
          <Route path="/ambassador" element={<AmbassadorPage />} />
          <Route path="/buyer" element={<BuyerMarketplace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/seller/:sellerName" element={<SellerPage />} />
          <Route path="/artisan/dashboard" element={<ArtisanDashboardPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
