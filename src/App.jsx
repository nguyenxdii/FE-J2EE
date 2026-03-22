import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { DashboardOverview } from '@/pages/admin/DashboardOverview';

function App() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={
        <MainLayout>
          <HomePage />
        </MainLayout>
      } />

      {/* Admin Routes */}
      <Route path="/dashboard/admin/*" element={
        <AdminLayout>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="*" element={<DashboardOverview />} />
          </Routes>
        </AdminLayout>
      } />
    </Routes>
  );
}

export default App;
