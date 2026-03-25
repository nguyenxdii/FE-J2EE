import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
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
import { AdminOrderPage } from '@/pages/admin/AdminOrderPage';
import { AdminStatisticsPage } from '@/pages/admin/AdminStatisticsPage';
import { AdminUserPage } from '@/pages/admin/AdminUserPage';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { AdminCategoryPage } from '@/pages/admin/AdminCategoryPage';
import { AdminVehiclePage } from '@/pages/admin/AdminVehiclePage';
import { AdminDepositPage } from '@/pages/admin/AdminDepositPage';
import { AdminTransactionPage } from '@/pages/admin/AdminTransactionPage';
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage';
import { BookingPage } from '@/pages/order/BookingPage';
import { OrderConfirmationPage } from '@/pages/order/OrderConfirmationPage';
import { OrderDetailPage } from '@/pages/order/OrderDetailPage';
import { VehicleSearchPage } from '@/pages/vehicles/VehicleSearchPage';
import { VehicleDetailPage } from '@/pages/vehicles/VehicleDetailPage';

import Settings from '@/pages/settings/Settings'; 
import UploadKYC from '@/pages/kyc/UploadKYC';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/vehicles" element={<MainLayout><VehicleSearchPage /></MainLayout>} />
        <Route path="/vehicles/:id" element={<MainLayout><VehicleDetailPage /></MainLayout>} />
        <Route path="/marketplace" element={<MainLayout><MarketplacePage /></MainLayout>} />
        <Route path="/wallet/callback" element={<MainLayout><WalletCallbackPage /></MainLayout>} />
        
        {/* --- Auth Routes (Guest only) --- */}
        <Route path="/login" element={<GuestRoute><MainLayout><LoginPage /></MainLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><MainLayout><RegisterPage /></MainLayout></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><MainLayout><ForgotPasswordPage /></MainLayout></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><MainLayout><ResetPasswordPage /></MainLayout></GuestRoute>} />

        {/* --- Protected Client Routes (Phải đăng nhập mới vào được) --- */}
        <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><MainLayout><WalletPage /></MainLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MainLayout><OrderHistoryPage /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationPage /></MainLayout></ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute><MainLayout><UploadKYC /></MainLayout></ProtectedRoute>} />
        
        {/* Booking & Order Routes */}
        <Route path="/booking/:vehicleId" element={<ProtectedRoute><MainLayout><BookingPage /></MainLayout></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute><MainLayout><OrderConfirmationPage /></MainLayout></ProtectedRoute>} />
        <Route path="/order/detail/:orderId" element={<ProtectedRoute><MainLayout><OrderDetailPage /></MainLayout></ProtectedRoute>} />

        {/* --- Admin Routes --- */}
        <Route path="/dashboard/admin/*" element={
          <ProtectedRoute allowRoles={['ADMIN']}>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUserPage />} />
                <Route path="verify" element={<AdminVerificationPage />} />
                <Route path="categories" element={<AdminCategoryPage />} />
                <Route path="vehicles" element={<AdminVehiclePage />} />
                <Route path="orders" element={<AdminOrderPage />} />
                <Route path="deposits" element={<AdminDepositPage />} />
                <Route path="transactions" element={<AdminTransactionPage />} />
                <Route path="stats/revenue" element={<AdminStatisticsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="*" element={<AdminDashboardPage />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* Trang 404 */}
        <Route path="*" element={<MainLayout><div>Trang không tồn tại</div></MainLayout>} />
      </Routes>
    </>
  );
}

export default App;