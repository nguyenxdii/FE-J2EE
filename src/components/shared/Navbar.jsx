import { Button } from "@/components/ui/button";
import { Car, Phone, Heart, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ShopCar</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Thuê xe</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Cho thuê</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Bảng giá</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Giới thiệu</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Phone className="w-4 h-4 mr-2" />
              (555) 123-4567
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
            <Button size="sm">
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
