import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar';
import Home from './Pages/Home/Home';
import Products from './Pages/Products/Products';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import Cart from './Pages/Cart/Cart';
import NotFound from './Pages/NotFound/NotFound';
import Checkout from './Pages/Checkout/CheckOut';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';
import About from './Pages/About/About';
import Collections from './Pages/Collection/Collection';
import Footer from './Components/Footer/Footer';
import Auth from './Pages/Authentication/Auth';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-28 text-gray-900">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={<ProtectedRoute> <Checkout /> </ProtectedRoute>}/>
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}