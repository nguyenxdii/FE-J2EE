import React, { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { depositService } from '@/services/depositService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Modal đăng bán
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, listingsRes] = await Promise.all([
        orderService.getMyOrders(),
        depositService.getListings() // Lấy hết và lọc lại ở FE (Hoặc BE nếu có api my-listings)
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (listingsRes.success) setListings(listingsRes.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Chờ cọc</Badge>;
      case 'CONFIRMED': return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Đã cọc</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Đã huỷ</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Hoàn thành</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Logic kiểm tra có thể đăng bán hay không
  const canPostListing = (order) => {
    const isCorrectStatus = ['CONFIRMED', 'PENDING'].includes(order.status);
    const isFutureOrder = dayjs(order.startDate).isAfter(dayjs().add(24, 'hour'));
    const isAlreadyListed = listings.some(l => l.order.id === order.id && l.status === 'OPEN');
    
    return isCorrectStatus && isFutureOrder && !isAlreadyListed;
  };

  const getListingForOrder = (orderId) => {
    return listings.find(l => l.order.id === orderId && l.status === 'OPEN');
  };

  const handleOpenPostModal = (order) => {
    setSelectedOrder(order);
    setSellingPrice(order.depositAmount.toString()); // Mặc định để giá bằng tiền cọc gốc
    setIsPostModalOpen(true);
  };

  const handlePostListing = async () => {
    const price = parseFloat(sellingPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Giá bán phải lớn hơn 0');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await depositService.createListing(selectedOrder.id, price);
      if (res.success) {
        toast.success('Đăng bán suất cọc thành công!');
        setIsPostModalOpen(false);
        fetchData(); // Reload
      } else {
        toast.error(res.message || 'Lỗi khi đăng bán');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelListing = async (listingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy bài đăng này?')) return;
    
    try {
      const res = await depositService.cancelListing(listingId);
      if (res.success) {
        toast.success('Đã hủy bài đăng');
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Lỗi khi hủy bài đăng');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-gray-500 mt-1">Nơi quản lý lịch trình và các lượt sang nhượng suất cọc</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500">Đang đồng bộ đơn hàng...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <Package className="w-20 h-20 text-gray-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Bạn chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mt-2">Hãy đặt xe ngay để bắt đầu hành trình của bạn.</p>
              <Button className="mt-6 bg-blue-600" onClick={() => navigate('/')}>Khám phá xe</Button>
            </div>
          ) : (
            orders.map((order) => {
              const activeListing = getListingForOrder(order.id);
              const canPost = canPostListing(order);

              return (
                <Card key={order.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-3xl">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Hình ảnh xe */}
                    <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0">
                      <img 
                        src={order.vehicle.images[0]} 
                        alt={order.vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Nội dung đơn hàng */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-gray-900 leading-none">
                              {order.vehicle.brand} {order.vehicle.model}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-400">Mã đơn: <span className="text-gray-600 font-mono font-bold uppercase">{order.id.substring(0, 8)}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase">Tiền cọc</p>
                          <p className="text-xl font-black text-blue-700">{formatCurrency(order.depositAmount)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm pt-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                          <span>Từ {dayjs(order.startDate).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                          <span>Đến {dayjs(order.endDate).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                          <span>Đã xác minh suất cọc</span>
                        </div>
                      </div>

                      {/* Nút hành động (Đăng bán / Hủy bài) */}
                      <div className="pt-4 flex flex-wrap gap-4">
                        {activeListing ? (
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                              <Tag className="w-4 h-4 mr-2 animate-pulse" />
                              Đang rao bán: {formatCurrency(activeListing.sellingPrice)}
                            </div>
                            <Button 
                              variant="ghost" 
                              className="text-red-500 font-bold hover:bg-red-50 rounded-xl"
                              onClick={() => handleCancelListing(activeListing.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Dừng rao bán
                            </Button>
                          </div>
                        ) : canPost ? (
                          <Button 
                            className="bg-gray-900 hover:bg-black text-white px-8 rounded-xl h-11 font-bold shadow-lg"
                            onClick={() => handleOpenPostModal(order)}
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            Rao bán suất cọc
                            <ArrowRight className="w-4 h-4 ml-6 opacity-40" />
                          </Button>
                        ) : order.status === 'CONFIRMED' ? (
                          <div className="flex items-center text-[11px] text-gray-400 bg-gray-50 p-2 rounded-lg italic">
                            <AlertCircle className="w-3.5 h-3.5 mr-2" />
                            Không thể đăng bán (Chỉ được đăng trước 24h khi khởi hành)
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Modal đăng bán suất cọc */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Rao bán suất cọc</DialogTitle>
              <DialogDescription className="text-blue-100/80 mt-2">
                Bạn muốn nhượng lại quyền thuê {selectedOrder?.vehicle.model} với giá bao nhiêu?
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Giá thanh lý (VND)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₫</span>
                <Input 
                  type="number"
                  className="h-14 pl-10 text-xl font-black bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 italic mt-1">
                * Tiền cọc gốc của bạn là {selectedOrder && formatCurrency(selectedOrder.depositAmount)}
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
              <div className="text-xs text-amber-800 leading-relaxed font-medium">
                Khi có người mua, đơn hàng sẽ được chuyển sang tên người đó. Bạn sẽ nhận lại tiền vào ví cá nhân ngay lập tức.
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 pb-10">
            <Button 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95"
              onClick={handlePostListing}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Xác nhận đăng bài</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
