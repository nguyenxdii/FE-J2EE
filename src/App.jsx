import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { DashboardOverview } from '@/pages/admin/DashboardOverview';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { WalletPage } from '@/pages/wallet/WalletPage';
import { WalletCallbackPage } from '@/pages/wallet/WalletCallbackPage';
import { MarketplacePage } from '@/pages/deposit/MarketplacePage';
import { OrderHistoryPage } from '@/pages/order/OrderHistoryPage';
import { NotificationPage } from '@/pages/notification/NotificationPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { Toaster } from 'sonner';
import { VehicleSearchPage } from '@/pages/vehicles/VehicleSearchPage';
import { VehicleDetailPage } from '@/pages/vehicles/VehicleDetailPage';
import { CategoryManagementPage } from '@/pages/admin/CategoryManagementPage';
import { VehicleManagementPage } from '@/pages/admin/VehicleManagementPage';
import { BookingPage } from '@/pages/order/BookingPage';
import { OrderConfirmationPage } from '@/pages/order/OrderConfirmationPage';
import { OrderDetailPage } from '@/pages/order/OrderDetailPage';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Client & Auth Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/vehicles" element={<MainLayout><VehicleSearchPage /></MainLayout>} />
        <Route path="/vehicles/:id" element={<MainLayout><VehicleDetailPage /></MainLayout>} />
        <Route path="/marketplace" element={<MainLayout><MarketplacePage /></MainLayout>} />
        <Route path="/wallet/callback" element={<MainLayout><WalletCallbackPage /></MainLayout>} />
        
        {/* Booking & Order Routes */}
        <Route path="/booking/:vehicleId" element={<ProtectedRoute><MainLayout><BookingPage /></MainLayout></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute><MainLayout><OrderConfirmationPage /></MainLayout></ProtectedRoute>} />
        <Route path="/order/detail/:orderId" element={<ProtectedRoute><MainLayout><OrderDetailPage /></MainLayout></ProtectedRoute>} />
        
        <Route path="/login" element={<GuestRoute><MainLayout><LoginPage /></MainLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><MainLayout><RegisterPage /></MainLayout></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><MainLayout><ForgotPasswordPage /></MainLayout></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><MainLayout><ResetPasswordPage /></MainLayout></GuestRoute>} />

        {/* Protected Client Routes */}
        <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><MainLayout><WalletPage /></MainLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MainLayout><OrderHistoryPage /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationPage /></MainLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/dashboard/admin/*" element={
        <ProtectedRoute allowRoles={['ADMIN']}>
          <AdminLayout>
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="categories" element={<CategoryManagementPage />} />
              <Route path="vehicles" element={<VehicleManagementPage />} />
              <Route path="*" element={<DashboardOverview />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
      </Routes>
    </>
  );
}

export default App;
