import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Loader2, 
  Calendar, 
  MapPin, 
  Info,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      } else {
        toast.error('Không tìm thấy thông tin đơn hàng');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Tiền cọc sẽ KHÔNG được hoàn lại nếu bạn chủ động hủy.')) {
      return;
    }

    try {
      setIsCancelling(true);
      const res = await orderService.cancelOrder(id);
      if (res.success) {
        toast.success('Đã hủy đơn hàng');
        fetchOrderDetail(); // Reload status
      } else {
        toast.error(res.message || 'Lỗi khi hủy đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setIsCancelling(false);
    }
  };
  
  const handleRepay = async () => {
    try {
      setIsPaying(true);
      const res = await orderService.repayOrder(id);
      if (res.success) {
        if (order.paymentMethod === 'MOMO' && res.data?.payUrl) {
          window.location.href = res.data.payUrl;
        } else {
          toast.success('Thanh toán thành công!');
          fetchOrderDetail();
        }
      } else {
        toast.error(res.message || 'Lỗi khi thanh toán');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" /> };
      case 'CONFIRMED': return { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'RENTING': return { label: 'Đang thuê', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Car className="w-4 h-4" /> };
      case 'COMPLETED': return { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'CANCELLED': return { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-4 h-4" /> };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      <button 
        onClick={() => navigate('/my-orders')}
        className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Quay lại danh sách đơn hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Main Info */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mã đơn hàng</p>
                <h1 className="text-2xl font-black text-gray-900">{order.orderCode}</h1>
              </div>
              <Badge className={`${statusInfo.color} px-3 py-1 flex items-center gap-2 border shadow-sm`}>
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
            </div>

            <Separator />

            {/* Car Info */}
            <div className="flex gap-4">
              <img 
                src={order.vehicleImage} 
                alt={order.vehicleName} 
                className="w-24 h-24 rounded-2xl object-cover shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{order.vehicleBrand}</Badge>
                  {order.isTransferred && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">Mua lại</Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{order.vehicleName}</h3>
                <p className="text-sm text-gray-500">{order.licensePlate}</p>
              </div>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian nhận</p>
                <p className="font-bold text-gray-800">{dayjs(order.startDate).format('DD/MM/YYYY')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian trả</p>
                <p className="font-bold text-gray-800">{dayjs(order.endDate).format('DD/MM/YYYY')}</p>
              </div>
            </div>

            {order.note && (
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Ghi chú từ bạn</p>
                <p className="text-sm text-blue-900 italic">"{order.note}"</p>
              </div>
            )}

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed font-medium">
                <strong>Quy trình nhận xe:</strong> Khi đến nhận xe, vui lòng chuẩn bị <b>{formatCurrency(order.rentalPrice)}</b> để thanh toán tiền thuê trực tiếp tại quầy. Tiền cọc của bạn đã được hệ thống ghi nhận.
              </div>
            </div>
          </section>

          {/* Cancel Section */}
          {order.status === 'PENDING' && (
            <div className="space-y-4">
              <Button 
                className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                onClick={handleRepay}
                disabled={isPaying}
              >
                {isPaying ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Thanh toán ngay ({formatCurrency(order.depositAmount)})
                  </>
                )}
              </Button>

              <section className="bg-red-50 p-6 rounded-3xl border border-red-100 space-y-4">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h3 className="text-red-900 font-bold">Hủy đơn hàng?</h3>
                    <p className="text-sm text-red-800 mt-1 leading-relaxed">
                      Bạn chỉ có thể hủy đơn hàng khi trạng thái là **Chờ thanh toán**. 
                      Lưu ý: Bạn sẽ không được hoàn lại tiền cọc nếu chủ động hủy đơn.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full h-12 rounded-xl font-bold shadow-sm"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận hủy đơn'}
                </Button>
              </section>
            </div>
          )}
        </div>

        {/* Right column: Invoice */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-gray-900 text-white rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 flex items-center justify-between border-b border-gray-800">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Hóa đơn</span>
              <Receipt className="w-5 h-5 text-blue-400" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiền thuê ({order.totalDays} ngày)</span>
                  <span className="font-mono text-amber-500">{formatCurrency(order.rentalPrice)} (Tại quầy)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiền đặt cọc</span>
                  <span className="font-mono text-green-400">{formatCurrency(order.depositAmount)} (Đã cọc)</span>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Cần thanh toán tại quầy</p>
                    <p className="text-3xl font-black text-white">{formatCurrency(order.rentalPrice)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Thanh toán</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-gray-700 bg-gray-800 text-gray-300">
                    {order.paymentMethod}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-gray-600'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Trạng thái tiền</span>
                  </div>
                  <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="text-[10px]">
                    {order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu'}
                  </Badge>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 text-center italic mt-4">
                Cảm ơn bạn đã tin dùng dịch vụ của chúng tôi!
              </p>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
            <p className="text-xs text-gray-500">Gặp vấn đề với đơn hàng?</p>
            <Button variant="outline" className="w-full text-blue-600 border-blue-100 hover:bg-blue-50 rounded-xl h-11 font-bold">
              Liên hệ hỗ trợ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
