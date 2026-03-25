import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Phone, Heart, User, LogOut, Menu, ShoppingCart, Wallet, Settings, Bell, ShieldCheck, LayoutDashboard } from "lucide-react";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/images/avatar.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { userService } from '@/services/userService';

export function Navbar() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    if (authService.isAuthenticated()) {
      updateBalance();
      fetchNotifications();
    }

    // Listen for manual balance updates
    window.addEventListener('balanceUpdate', updateBalance);
    return () => window.removeEventListener('balanceUpdate', updateBalance);
  }, [location.pathname]);

  const updateBalance = async () => {
    const b = await userService.getWalletBalance();
    setBalance(b);
  };

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
    setUser(null);
    setIsLogoutOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl font-black text-blue-600 tracking-tighter">
                ShopCar
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="/marketplace"
                className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
              >
                Săn cọc giá rẻ
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">0912 345 678</span>
              </div>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-600 hover:text-gray-900 relative flex items-center justify-center p-2">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
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
              )}

              {user && (
                <div className="hidden lg:flex flex-col items-end px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 mr-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400">Số dư ví</span>
                  <span className="text-sm font-bold text-blue-700">
                    {balance.toLocaleString()}đ
                  </span>
                </div>
              )}

              {user ? (
                <div className="pl-2 border-l border-gray-200 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage src={(user.avatar && user.avatar !== "") ? user.avatar : defaultAvatar} alt={user.fullName} />
                          <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm font-medium leading-none text-gray-900">{user.fullName}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs leading-none text-gray-500 font-semibold uppercase tracking-wider">{user.role}</p>
                            {user.kycStatus === 'VERIFIED' && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.role === 'ADMIN' && (
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/admin" className="cursor-pointer w-full flex items-center text-white font-medium bg-blue-600 hover:bg-blue-700 py-2 focus:bg-blue-700 focus:text-white">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Vào trang Quản trị</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <User className="mr-2 h-4 w-4" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/kyc" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Xác minh danh tính</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Đơn của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wallet" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <Wallet className="mr-2 h-4 w-4" />
                          <span>Ví</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/notifications" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Thông báo</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 py-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          setIsLogoutOpen(true);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gray-900 hover:bg-black text-white px-5 shadow-sm">Đăng ký</Button>
                  </Link>
                </div>
              )}

              {/* Mobile indicator */}
              <button className="md:hidden text-gray-600 hover:text-gray-900 p-2 ml-1">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình? Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng các dịch vụ đặt xe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200">
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
