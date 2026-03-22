import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Phone, Heart, User, LogOut, Menu, ShoppingCart, Wallet, Settings } from "lucide-react";
import { authService } from "@/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function Navbar() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [location.pathname]);

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
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
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
                to="/vehicles"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Thuê xe
              </Link>
              <Link
                to="/deposits"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Săn cọc giá rẻ
              </Link>

              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Giới thiệu
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">0912 345 678</span>
              </div>

              <button className="text-gray-600 hover:text-gray-900 relative flex items-center justify-center p-2 hidden sm:flex">
                <Heart className="h-5 w-5" />
                {user && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border border-white"></span>
                )}
              </button>

              {user ? (
                <div className="pl-2 border-l border-gray-200 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage src="" alt={user.fullName} />
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
                          <p className="text-xs leading-none text-gray-500 font-semibold uppercase tracking-wider">{user.role}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/my-orders" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
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
                        <Link to="/settings" className="cursor-pointer w-full flex items-center text-gray-700 py-2">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Cài đặt</span>
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

