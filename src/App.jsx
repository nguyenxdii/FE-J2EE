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
import { Toaster } from 'sonner';
import { VehicleSearchPage } from '@/pages/vehicles/VehicleSearchPage';
import { VehicleDetailPage } from '@/pages/vehicles/VehicleDetailPage';

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
