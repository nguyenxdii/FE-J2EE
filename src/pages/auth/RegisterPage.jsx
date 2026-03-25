import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    setIsLoading(true);
    try {
      const { fullName, email, phone, password } = formData;
      const response = await authService.sendOtp({ fullName, email, phone, password });
      
      if (response.success) {
        toast.success(response.message || "Mã OTP đã được gửi đến email của bạn");
        setStep(2);
      } else {
        toast.error(response.message || "Không thể gửi OTP");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(formData, otp);
      if (response.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        navigate('/login');
      } else {
        toast.error(response.message || "Mã OTP không đúng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác thực");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 my-auto">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {step === 1 ? "Tạo tài khoản mới" : "Xác nhận thực email"}
            </h1>
            <p className="mt-2 text-base text-gray-600">
              {step === 1 
                ? "Điền thông tin bên dưới để trở thành thành viên của ShopCar."
                : `Chúng tôi đã gửi mã OTP 6 số đến ${formData.email}.`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5 mt-8">
              <div className="space-y-2 relative">
                <Label htmlFor="fullName">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input 
                    id="fullName" 
                    placeholder="Nguyễn Văn An" 
                    className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 relative">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input 
                      id="phone" 
                      placeholder="0912345xxx" 
                      className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required 
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-2 text-base font-semibold bg-gray-900 hover:bg-black text-white shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang gửi OTP...
                  </>
                ) : (
                  <>
                    Tiếp tục
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5 mt-8">
              <div className="space-y-2 relative">
                <Label htmlFor="otp">Mã xác thực (6 số)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input 
                    id="otp" 
                    placeholder="123456" 
                    className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-center text-2xl tracking-[1em]"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-2 text-base font-semibold bg-gray-900 hover:bg-black text-white shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    Xác nhận đăng ký
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-900 mt-2"
              >
                Quay lại sửa thông tin
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 pt-2">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-gray-900 hover:underline transition-colors">
              Đăng nhập ngay
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            Bằng cách đăng ký, bạn đồng ý với <a href="#" className="underline hover:text-gray-600 transition-colors">Điều khoản dịch vụ</a> và <a href="#" className="underline hover:text-gray-600 transition-colors">Chính sách bảo mật</a> của ShopCar.
          </p>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">Bắt Đầu Hành Trình Mới</h2>
          <p className="text-lg lg:text-xl text-gray-200 font-light opacity-90">
            Trải nghiệm dịch vụ thuê xe đẳng cấp với thủ tục nhanh gọn và hàng ngàn lựa chọn đáng tin cậy.
          </p>
        </div>
      </div>
    </div>
  );
}
