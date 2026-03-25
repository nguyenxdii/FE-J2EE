import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Tags, 
  Bike, 
  ShoppingCart, 
  ShoppingBag,
  ArrowRightLeft,
  Key, 
  History, 
  BarChart3, 
  FileText,
  LogOut,
  Menu,
  X,
  Bell,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { notificationService } from '@/services/notificationService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res?.data?.notifications || []);
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Tổng quan', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Người dùng', path: '/dashboard/admin/users', icon: Users },
    { label: 'Xác minh CCCD', path: '/dashboard/admin/verify', icon: ShieldCheck },
    { label: 'Danh mục xe', path: '/dashboard/admin/categories', icon: Tag },
    { label: 'Quản lý xe', path: '/dashboard/admin/vehicles', icon: Bike },
    { label: 'Đơn hàng', path: '/dashboard/admin/orders', icon: ShoppingCart },
    { label: 'Marketplace', path: '/dashboard/admin/deposits', icon: ShoppingBag },
    { label: 'Giao dịch cọc', path: '/dashboard/admin/transactions', icon: ArrowRightLeft },
    { label: 'Thống kê', path: '/dashboard/admin/stats/revenue', icon: BarChart3 },
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
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Thông báo</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={async () => {
                        await notificationService.markAllAsRead();
                        fetchNotifications();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đọc tất cả
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex justify-between gap-2 mb-1">
                          <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {n.createdAt ? dayjs(n.createdAt).fromNow() : 'Vừa xong'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Không có thông báo nào</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t text-center bg-gray-50/50">
                  <Link to="/notifications" className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Xem tất cả thông báo
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
