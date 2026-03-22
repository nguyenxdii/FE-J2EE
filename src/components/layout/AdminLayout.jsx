import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Tags, 
  Bike, 
  ShoppingCart, 
  Key, 
  History, 
  BarChart3, 
  FileText,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard/admin' },
    { icon: Users, label: 'Người dùng', path: '/dashboard/admin/users' },
    { icon: ShieldCheck, label: 'Duyệt CCCD', path: '/dashboard/admin/verify' },
    { icon: Tags, label: 'Danh mục', path: '/dashboard/admin/categories' },
    { icon: Bike, label: 'Quản lý xe', path: '/dashboard/admin/vehicles' },
    { icon: ShoppingCart, label: 'Đơn hàng', path: '/dashboard/admin/orders' },
    { icon: Key, label: 'Suất cọc', path: '/dashboard/admin/deposits' },
    { icon: History, label: 'Lịch sử sang tên', path: '/dashboard/admin/transactions' },
    { icon: BarChart3, label: 'Doanh thu', path: '/dashboard/admin/stats/revenue' },
    { icon: FileText, label: 'Báo cáo', path: '/dashboard/admin/stats/reports' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/dashboard/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Bike className="w-8 h-8 text-blue-600" />
            {isSidebarOpen && <span className="text-xl font-bold text-gray-900">ShopCar</span>}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
