import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { DashboardOverview } from '@/pages/admin/DashboardOverview';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Client & Auth Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />

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
