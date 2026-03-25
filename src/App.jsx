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
import { AdminOrderPage } from '@/pages/admin/AdminOrderPage';
import { AdminStatisticsPage } from '@/pages/admin/AdminStatisticsPage';
import { AdminUserPage } from '@/pages/admin/AdminUserPage';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { AdminCategoryPage } from '@/pages/admin/AdminCategoryPage';
import { AdminVehiclePage } from '@/pages/admin/AdminVehiclePage';
import { AdminDepositPage } from '@/pages/admin/AdminDepositPage';
import { AdminTransactionPage } from '@/pages/admin/AdminTransactionPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Client & Auth Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/marketplace" element={<MainLayout><MarketplacePage /></MainLayout>} />
        <Route path="/wallet/callback" element={<MainLayout><WalletCallbackPage /></MainLayout>} />
        
        <Route path="/login" element={<GuestRoute><MainLayout><LoginPage /></MainLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><MainLayout><RegisterPage /></MainLayout></GuestRoute>} />

        {/* Protected Client Routes */}
        <Route path="/wallet" element={<ProtectedRoute><MainLayout><WalletPage /></MainLayout></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MainLayout><OrderHistoryPage /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationPage /></MainLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/dashboard/admin/*" element={
        <ProtectedRoute allowRoles={['ADMIN']}>
            <AdminLayout>
              <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="users" element={<AdminUserPage />} />
                <Route path="verify" element={<AdminVerificationPage />} />
                <Route path="categories" element={<AdminCategoryPage />} />
                <Route path="vehicles" element={<AdminVehiclePage />} />
                <Route path="orders" element={<AdminOrderPage />} />
                <Route path="deposits" element={<AdminDepositPage />} />
                <Route path="transactions" element={<AdminTransactionPage />} />
                <Route path="stats/revenue" element={<AdminStatisticsPage />} />
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
