import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '@/services/vehicleService';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  Info, 
  Loader2, 
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export function BookingPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(3, 'day').format('YYYY-MM-DD'));
  const [note, setNote] = useState('');
  const [bookedOrders, setBookedOrders] = useState([]);

  useEffect(() => {
    fetchVehicle();
    fetchBookedDates();
  }, [vehicleId]);

  const fetchBookedDates = async () => {
    try {
      const res = await orderService.getVehicleOrders(vehicleId);
      if (res.success) {
        setBookedOrders(res.data);
      }
    } catch (error) {
      console.error('Không thể tải lịch bận của xe');
    }
  };

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await vehicleService.getVehicleById(vehicleId);
      // API vehicles trả về object trực tiếp, không bọc trong ApiResponse
      if (res && (res.id || res._id)) {
        setVehicle(res);
      } else {
        toast.error('Không tìm thấy thông tin xe');
        navigate('/');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'day');
    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateTotalDays();
  const rentalPrice = vehicle ? vehicle.pricePerDay * totalDays : 0;
  const depositAmount = vehicle ? vehicle.depositAmount : 0;
  const totalAmount = rentalPrice + depositAmount;

  const handleContinue = () => {
    if (totalDays <= 0) {
      toast.error('Ngày trả xe phải sau ngày nhận xe ít nhất 1 ngày');
      return;
    }

    if (dayjs(startDate).isBefore(dayjs(), 'day')) {
      toast.error('Ngày nhận xe không được trong quá khứ');
      return;
    }

    // Kiểm tra trùng lịch
    const hasOverlap = bookedOrders.some(order => {
      if (order.status === 'CANCELLED') return false;
      const bookedStart = dayjs(order.startDate);
      const bookedEnd = dayjs(order.endDate);
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      
      // Check overlap: [start, end] overlaps with [bookedStart, bookedEnd]
      return (start.isBefore(bookedEnd) || start.isSame(bookedEnd)) && 
             (end.isAfter(bookedStart) || end.isSame(bookedStart));
    });

    if (hasOverlap) {
      toast.error('Khoản thời gian trên đã có người đặt');
      return;
    }

    // Chuyển sang trang xác nhận, truyền data qua state
    navigate('/order/confirm', { 
      state: { 
        vehicle, 
        startDate, 
        endDate, 
        totalDays, 
        rentalPrice, 
        depositAmount, 
        totalAmount,
        note
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Đang tải thông tin xe...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h1 className="text-2xl font-black text-gray-900">Chi tiết chuyến đi</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-500" />
                  Ngày nhận xe
                </label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={dayjs().format('YYYY-MM-DD')}
                  className="h-12 rounded-xl bg-gray-50 border-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-red-500" />
                  Ngày trả xe
                </label>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={dayjs(startDate).add(1, 'day').format('YYYY-MM-DD')}
                  className="h-12 rounded-xl bg-gray-50 border-gray-100"
                />
              </div>
            </div>

            {bookedOrders.length > 0 && (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  Lịch xe đã được đặt (Lưu ý tránh chọn trùng):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bookedOrders.map((order, idx) => (
                    <div key={idx} className="text-xs text-amber-700 bg-white/50 p-2 rounded-lg border border-amber-100">
                      • {dayjs(order.startDate).format('DD/MM')} - {dayjs(order.endDate).format('DD/MM')} ({order.status === 'PENDING' ? 'Chờ TT' : 'Đã cọc'})
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Ghi chú (Tùy chọn)</label>
              <textarea 
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
                placeholder="Ví dụ: Tôi sẽ nhận xe lúc 8h sáng..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4 border border-blue-100">
            <Info className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-sm text-blue-800 leading-relaxed">
              <strong>Chính sách cọc:</strong> Tiền cọc sẽ được giữ để đảm bảo cho chuyến đi. Bạn sẽ nhận lại 100% tiền cọc sau khi hoàn tất trả xe và không có vi phạm phát sinh.
            </div>
          </section>
        </div>

        {/* Right: Summary Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src={vehicle?.images[0]} 
                alt={vehicle?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">{vehicle?.brand}</Badge>
                <h3 className="text-xl font-black text-gray-900 leading-tight">
                  {vehicle?.name.replace(/\s\d{4}$/, '')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{vehicle?.licensePlate}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Tiền thuê ({totalDays} ngày)</span>
                  <span className="text-gray-900 font-bold">{new Intl.NumberFormat('vi-VN').format(rentalPrice)}đ</span>
                </div>
                <div className="flex justify-between text-xs text-indigo-500 ml-4">
                  <span>(Thanh toán tại quầy khi nhận xe)</span>
                </div>
                
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-500 font-medium">Tiền đặt cọc</span>
                  <span className="text-gray-900 font-bold">{new Intl.NumberFormat('vi-VN').format(depositAmount)}đ</span>
                </div>
                <div className="flex justify-between text-xs text-blue-500 ml-4">
                  <span>(Thanh toán ngay bây giờ)</span>
                </div>

                <Separator className="border-dashed" />
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">Thanh toán ngay</span>
                    <span className="text-lg font-black text-gray-900">Tiền cọc</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">
                    {new Intl.NumberFormat('vi-VN').format(depositAmount)}đ
                  </span>
                </div>
              </div>

              <Button 
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-blue-100"
                onClick={handleContinue}
              >
                Tiếp tục
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Bảo mật & An toàn
              </div>
            </CardContent>
          </Card>

          {totalDays > 0 && (
            <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-3 border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-xs text-amber-800 font-medium">
                Vui lòng kiểm tra kỹ ngày nhận/trả trước khi tiếp tục.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
