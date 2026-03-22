import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        toast.success('Đăng nhập thành công');
        // Redirect based on role
        if (result.user.role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(result.message || 'Email hoặc mật khẩu không chính xác');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chào mừng trở lại</h1>
            <p className="mt-2 text-base text-gray-600">Đăng nhập để trải nghiệm dịch vụ thuê xe tuyệt vời nhất cùng ShopCar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div className="space-y-2 relative">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end pt-1">
                <Link to="/forgot-password" title="Chưa hỗ trợ" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-black text-white shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-gray-900 hover:underline transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Test Accounts Tip */}
        <div className="absolute bottom-4 left-8 text-xs text-gray-400 hidden xl:block">
          Demo: admin@shopcar.com / 123qwe123
        </div>
      </div>
      
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury car showcase" 
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000" 
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">Tìm Kiếm Chiếc Xe Hoàn Hảo</h2>
          <p className="text-lg lg:text-xl text-gray-200 font-light opacity-90">
            Khám phá hàng nghìn phương tiện chất lượng từ các đối tác tin cậy. Chiếc xe mơ ước chỉ cách bạn một cú nhấp chuột.
          </p>
        </div>
      </div>
    </div>
  );
}
