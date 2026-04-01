import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MarketingHome from './pages/MarketingHome';
import PremiumLanding from './pages/PremiumLanding';
import CategoryPage from './pages/CategoryPage';
import OrderFlow from './pages/OrderFlow';
import CreateSong from './pages/CreateSong';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MobileScreens from './pages/MobileScreens';
import DesignSystem from './pages/DesignSystem';
import SamplesPage from './pages/SamplesPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/songcreater">
        <div className="min-h-screen bg-[#0c0c0f] font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<MarketingHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/create-song" element={<CreateSong />} />
            <Route path="/order" element={<OrderFlow />} />
            <Route path="/premium" element={<PremiumLanding />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/mobile" element={<MobileScreens />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
