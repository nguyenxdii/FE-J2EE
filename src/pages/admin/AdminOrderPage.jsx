import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MoreVertical, 
  AlertCircle 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import api from '@/services/api';
import { toast } from 'sonner';

export function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // States for Cancel Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data || []);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleCancelClick = (id) => {
    setSelectedOrderId(id);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn');
      return;
    }

    try {
      setIsCanceling(true);
      await api.post(`/admin/orders/${selectedOrderId}/cancel`, { reason: cancelReason });
      toast.success('Hủy đơn và hoàn tiền thành công');
      setIsCancelModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error('Lỗi khi hủy đơn');
    } finally {
      setIsCanceling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đã xác nhận</span>;
      case 'RENTING':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1"><Truck className="w-3 h-3"/> Đang thuê</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3"/> Đã hủy</span>;
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (order.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Tìm theo mã đơn/user..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="RENTING">Đang thuê</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày thuê</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiền cọc</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{order.orderCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-semibold text-gray-900">{order.userName || 'N/A'}</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">{order.userId.substring(0, 10)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{order.startDate}</div>
                    <div className="text-xs text-gray-400">đến {order.endDate}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    <div className="flex flex-col">
                      <span>{order.depositAmount?.toLocaleString()}đ</span>
                      {order.isTransferred && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded w-fit border border-amber-100 uppercase">Sang nhượng</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'CONFIRMED')} disabled={order.status !== 'PENDING'}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600"/> Xác nhận
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'RENTING')} disabled={order.status !== 'CONFIRMED'}>
                          <Truck className="w-4 h-4 mr-2 text-purple-600"/> Giao xe
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'COMPLETED')} disabled={order.status !== 'RENTING'}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600"/> Hoàn thành
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCancelClick(order.id)} disabled={order.status === 'CANCELLED' || order.status === 'COMPLETED'} className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2"/> Hủy & Hoàn tiền
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Không tìm thấy đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/30">
            <p className="text-sm text-gray-500 font-medium">
              Trang <span className="text-blue-600">{currentPage}</span> / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => {
                   setCurrentPage(p => p - 1);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Trước
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => {
                   setCurrentPage(p => p + 1);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Xác nhận hủy đơn hàng
            </DialogTitle>
            <DialogDescription>
              Hành động này sẽ hủy đơn hàng và hoàn tiền cọc vào ví của khách hàng. Vui lòng nhập lý do cụ thể.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Lý do hủy đơn</label>
            <Textarea 
              placeholder="Nhập lý do hủy đơn (ví dụ: Xe đang bảo trì, khách hàng yêu cầu...)"
              className="resize-none h-32"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} disabled={isCanceling}>
              Bỏ qua
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancelOrder} 
              disabled={isCanceling || !cancelReason.trim()}
              className="min-w-[120px]"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận hủy'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
