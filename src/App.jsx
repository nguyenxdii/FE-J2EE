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

// 1. NHỚ IMPORT FILE KYC VÀ SETTINGS Ở ĐÂY
import Settings from './pages/settings/Settings'; 
import UploadKYC from './pages/kyc/UploadKYC'; // <--- THÊM DÒNG NÀY

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/marketplace" element={<MainLayout><MarketplacePage /></MainLayout>} />
        <Route path="/wallet/callback" element={<MainLayout><WalletCallbackPage /></MainLayout>} />
        
        {/* --- Auth Routes (Guest only) --- */}
        <Route path="/login" element={<GuestRoute><MainLayout><LoginPage /></MainLayout></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><MainLayout><RegisterPage /></MainLayout></GuestRoute>} />

        {/* --- Protected Client Routes (Phải đăng nhập mới vào được) --- */}
        <Route path="/wallet" element={<ProtectedRoute><MainLayout><WalletPage /></MainLayout></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MainLayout><OrderHistoryPage /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationPage /></MainLayout></ProtectedRoute>} />
        
        {/* TRANG SETTINGS */}
        <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />

        {/* 2. THÊM ROUTE CHO TRANG KYC Ở ĐÂY - ĐỂ NÓ KHÔNG BÁO LỖI 404 NỮA */}
        <Route path="/kyc" element={<ProtectedRoute><MainLayout><UploadKYC /></MainLayout></ProtectedRoute>} />

        {/* --- Admin Routes --- */}
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
        
        {/* Trang 404 (Sẽ hiện nếu không khớp các path ở trên) */}
        <Route path="*" element={<MainLayout><div>Trang không tồn tại</div></MainLayout>} />
      </Routes>
    </>
  );
}

export default App;