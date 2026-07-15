import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import HomePage from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';

// Dashboard
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import ProfilePage from './pages/Dashboard/Profile';
import OrdersPage from './pages/Dashboard/Orders';
import WishlistPage from './pages/Dashboard/Wishlist';
import AddressesPage from './pages/Dashboard/Addresses';

// Admin
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCustomers from './pages/Admin/AdminCustomers';

// Static
import AboutPage from './pages/Static/About';
import ContactPage from './pages/Static/Contact';
import FAQPage from './pages/Static/FAQ';
import ShippingPolicy from './pages/Static/ShippingPolicy';
import { PrivacyPolicy, TermsAndConditions } from './pages/Static/Legal';

function NotFound() {
  return (
    <div className="container-main py-24 text-center">
      <div className="text-8xl mb-6">🥒</div>
      <h1 className="font-serif text-4xl font-bold text-gray-800 mb-3">404 — Page Not Found</h1>
      <p className="text-gray-500 mb-8">Looks like this jar is empty! Let's get you back to the good stuff.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}

function WithLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth pages (no Navbar/Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin (separate layout) */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>

            {/* All store pages wrapped in Layout */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductListing /></Layout>} />
            <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
            <Route path="/order-success/:orderId" element={<Layout><ProtectedRoute><OrderSuccess /></ProtectedRoute></Layout>} />

            {/* Dashboard nested routes */}
            <Route path="/dashboard" element={<Layout><ProtectedRoute><DashboardLayout /></ProtectedRoute></Layout>}>
              <Route index element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="addresses" element={<AddressesPage />} />
            </Route>

            {/* Static pages */}
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
            <Route path="/shipping-policy" element={<Layout><ShippingPolicy /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />

            {/* 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
