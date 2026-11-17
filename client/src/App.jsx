import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Loader from './Components/Loader/Loader';

// Lazy-loaded pages for optimal performance and smaller initial bundle size
const Home = lazy(() => import('./Pages/Home/Home'));
const Products = lazy(() => import('./Pages/Products/Products'));
const Collections = lazy(() => import('./Pages/Collection/Collection'));
const ProductDetail = lazy(() => import('./Pages/ProductDetail/ProductDetail'));
const About = lazy(() => import('./Pages/About/About'));
const Cart = lazy(() => import('./Pages/Cart/Cart'));
const Checkout = lazy(() => import('./Pages/Checkout/CheckOut'));
const MyOrders = lazy(() => import('./Pages/MyOrders/MyOrders'));
const OrderSuccess = lazy(() => import('./Pages/OrderSuccess/OrderSuccess'));
const Auth = lazy(() => import('./Pages/Authentication/Auth'));
const Login = lazy(() => import('./Pages/Login/Login'));
const Register = lazy(() => import('./Pages/Register/Register'));
const NotFound = lazy(() => import('./Pages/NotFound/NotFound'));

// Automatically scrolls window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-28 text-gray-900 selection:bg-indigo-500 selection:text-white">
      <ScrollToTop />
      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 mb-16">
        <Suspense fallback={<Loader fullScreen={false} text="Loading Veyora..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}