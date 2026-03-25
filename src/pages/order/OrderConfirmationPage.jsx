import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { walletService } from '@/services/walletService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  CreditCard, 
  Wallet, 
  Loader2, 
  CheckCircle2,
  Calendar,
  MapPin,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('WALLET');

  const [walletBalance, setWalletBalance] = useState(0);

  const { 
    vehicle, 
    startDate, 
    endDate, 
    totalDays, 
    rentalPrice, 
    depositAmount, 
    totalAmount,
    note 
  } = location.state || {};

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await walletService.getWalletBalance();
        if (res.success) setWalletBalance(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy số dư ví');
      }
    };
    fetchBalance();
  }, []);

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Thiếu thông tin đơn hàng</p>
        <Button variant="link" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      const res = await orderService.createOrder({
        vehicleId: vehicle.id,
        startDate,
        endDate,
        paymentMethod,
        note
      });

      if (res.success) {
        if (paymentMethod === 'MOMO') {
          // Nếu là MOMO, chuyển hướng sang payUrl
          window.location.href = res.data.payUrl;
        } else {
          // Nếu là WALLET, chuyển sang trang thành công/chi tiết
          toast.success('Đặt xe thành công!');
          navigate(`/order/detail/${res.data.id}`);
        }
      } else {
        toast.error(res.message || 'Lỗi khi tạo đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kiểm tra lại ngày
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900">Xác nhận đặt xe</h1>
            <p className="text-gray-500">Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi thanh toán.</p>
          </section>

          {/* Vehicle Info Card */}
          <Card className="border-none shadow-sm bg-gray-50/50 rounded-3xl p-6">
            <div className="flex gap-6">
              <img 
                src={vehicle.images[0]} 
                alt={vehicle.name} 
                className="w-24 h-24 rounded-2xl object-cover shadow-sm"
              />
              <div className="space-y-1">
                <Badge variant="outline" className="bg-white">{vehicle.brand}</Badge>
                <h3 className="text-xl font-bold text-gray-900">{vehicle.name.replace(/\s\d{4}$/, '')}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {vehicle.location || 'Hà Nội'}
                </div>
              </div>
            </div>
          </Card>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-white space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhận xe</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-gray-800">{dayjs(startDate).format('DD/MM/YYYY')}</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 bg-white space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trả xe</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="font-bold text-gray-800">{dayjs(endDate).format('DD/MM/YYYY')}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Phương thức thanh toán</h2>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setPaymentMethod('WALLET')}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'WALLET' 
                  ? 'border-blue-600 bg-blue-50/30' 
                  : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'WALLET' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <Wallet className={`w-6 h-6 ${paymentMethod === 'WALLET' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">Ví cá nhân</p>
                    <p className="text-xs text-gray-500">Số dư: <span className="text-blue-600 font-bold">{formatCurrency(walletBalance)}</span></p>
                  </div>
                </div>
                {paymentMethod === 'WALLET' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
              </button>

              <button 
                onClick={() => setPaymentMethod('MOMO')}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'MOMO' 
                  ? 'border-pink-600 bg-pink-50/30' 
                  : 'border-gray-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'MOMO' ? 'bg-pink-600' : 'bg-gray-100'}`}>
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'MOMO' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">Ví Momo</p>
                    <p className="text-xs text-gray-500">Kết nối ứng dụng Momo để thanh toán</p>
                  </div>
                </div>
                {paymentMethod === 'MOMO' && <CheckCircle2 className="w-6 h-6 text-pink-600" />}
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <Card className="border-none shadow-2xl bg-gray-900 text-white rounded-3xl overflow-hidden p-8">
              <h2 className="text-xl font-bold mb-6">Chi tiết thanh toán</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiền thuê ({totalDays} ngày)</span>
                  <span className="font-mono text-gray-500 italic">{formatCurrency(rentalPrice)} (Tại quầy)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400 font-bold">Tiền đặt cọc</span>
                  <span className="font-mono font-bold">{formatCurrency(depositAmount)}</span>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-xs font-black text-blue-400 uppercase">Thanh toán ngay (Tiền cọc)</p>
                    <p className="text-3xl font-black text-white">{formatCurrency(depositAmount)}</p>
                  </div>
                </div>

                <Button 
                  className={`w-full h-16 mt-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                    paymentMethod === 'MOMO' 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={isSubmitting}
                  onClick={handlePayment}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>Thanh toán ngay</>
                  )}
                </Button>
                
                <p className="text-[10px] text-gray-500 text-center font-medium leading-relaxed">
                  Bằng việc nhấn Thanh toán, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi.
                </p>
              </div>
            </Card>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase">Hỗ trợ thanh toán</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <CreditCard className="w-4 h-4" />
                Giao dịch bảo mật 100%
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4" />
                Nhận xe nhanh chóng sau khi thanh toán
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
