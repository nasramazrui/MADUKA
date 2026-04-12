import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import SearchPage from '@/pages/customer/SearchPage';
import CartPage from '@/pages/customer/CartPage';
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage';
import ProfilePage from '@/pages/customer/ProfilePage';
import VendorDetailPage from '@/pages/customer/VendorDetailPage';

// Guards
function RoleGuard({ children, roles }: { children: React.ReactNode, roles: string[] }) {
  const { user, loading } = useAuthStore();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
      <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-black text-[#1A1A2E] animate-pulse">SwiftApp ⚡</p>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  
  if (!roles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'VENDOR') return <Navigate to="/vendor" />;
    if (user.role === 'DRIVER') return <Navigate to="/driver" />;
    return <Navigate to="/home" />;
  }

  // Vendor Approval Check
  if (user.role === 'VENDOR' && !user.vendor?.isApproved && !window.location.pathname.includes('/vendor/pending')) {
    return <Navigate to="/vendor/pending" />;
  }

  return <>{children}</>;
}

function VendorPendingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8F9FA] text-center">
      <div className="w-24 h-24 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
      <h1 className="text-2xl font-black text-[#1A1A2E] mb-2">Akaunti yako inasubiri idhini</h1>
      <p className="text-[#6B7280] max-w-md mb-8">
        Timu yetu inahakiki nyaraka zako. Utapata arifa pindi akaunti yako itakapowashwa. Kawaida inachukua chini ya saa 24.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="outline" className="rounded-xl font-bold">Wasiliana na Msaada</Button>
        <button onClick={() => auth.signOut()} className="text-sm font-bold text-red-500 hover:underline">Toka kwenye akaunti</button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Customer Routes */}
        <Route path="/home" element={
          <RoleGuard roles={['CUSTOMER']}>
            <HomePage />
          </RoleGuard>
        } />
        <Route path="/search" element={
          <RoleGuard roles={['CUSTOMER']}>
            <SearchPage />
          </RoleGuard>
        } />
        <Route path="/cart" element={
          <RoleGuard roles={['CUSTOMER']}>
            <CartPage />
          </RoleGuard>
        } />
        <Route path="/orders" element={
          <RoleGuard roles={['CUSTOMER']}>
            <OrderHistoryPage />
          </RoleGuard>
        } />
        <Route path="/profile" element={
          <RoleGuard roles={['CUSTOMER']}>
            <ProfilePage />
          </RoleGuard>
        } />
        <Route path="/vendor/:id" element={
          <RoleGuard roles={['CUSTOMER']}>
            <VendorDetailPage />
          </RoleGuard>
        } />

        {/* Vendor Routes */}
        <Route path="/vendor/pending" element={
          <RoleGuard roles={['VENDOR']}>
            <VendorPendingPage />
          </RoleGuard>
        } />
        <Route path="/vendor/*" element={
          <RoleGuard roles={['VENDOR']}>
            <div className="p-8 text-center font-black">Vendor Dashboard Coming Soon</div>
          </RoleGuard>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <RoleGuard roles={['ADMIN']}>
            <div className="p-8 text-center font-black">Admin Dashboard Coming Soon</div>
          </RoleGuard>
        } />

        {/* Driver Routes */}
        <Route path="/driver/*" element={
          <RoleGuard roles={['DRIVER']}>
            <div className="p-8 text-center font-black">Driver Dashboard Coming Soon</div>
          </RoleGuard>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </Router>
  );
}

import { auth } from '@/lib/firebase';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
