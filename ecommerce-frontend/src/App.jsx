import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const Cart = lazy(() => import('./pages/cart/Cart'));
import Checkout from './pages/cart/Checkout';
import OrderConfirmation from './pages/cart/OrderConfirmation';
const Profile = lazy(() => import('./pages/user/Profile'));
const Orders = lazy(() => import('./pages/user/Orders'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const Offers = lazy(() => import('./pages/user/Offers'));
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './components/layout/AdminLayout';
const AdminProducts = lazy(() => import('./pages/admin/Products'));
import AdminAddProduct from './pages/admin/AddProduct';
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminEditProduct = lazy(() => import('./pages/admin/EditProduct'));

const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));
const AdminShipping = lazy(() => import('./pages/admin/Shipping'));
const AdminReturns = lazy(() => import('./pages/admin/Returns'));
const AdminMarketing = lazy(() => import('./pages/admin/Marketing'));
const AdminRoles = lazy(() => import('./pages/admin/Roles'));
const AdminSupport = lazy(() => import('./pages/admin/Support'));
const AdminAITools = lazy(() => import('./pages/admin/AITools'));
const AdminLogs = lazy(() => import('./pages/admin/Logs'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return (isAuthenticated && (user?.email === 'admin@hub.com' || user?.role === 'admin')) ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* User Protected Routes */}
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="offers" element={<Offers />} />
          </Route>

          {/* Admin Routes (Independent of main Layout) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="ai-tools" element={<AdminAITools />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="edit-product/:id" element={<AdminEditProduct />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
