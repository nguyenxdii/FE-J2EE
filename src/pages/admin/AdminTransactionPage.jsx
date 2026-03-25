import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  History, 
  DollarSign, 
  ArrowRightLeft,
  Calendar,
  User,
  Search,
  Filter,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminTransactionPage() {
  const [data, setData] = useState({ transfers: [], totalPlatformFees: 0 });
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transfersRes, allRes] = await Promise.all([
        api.get('/admin/transfers/history'),
        api.get('/admin/transactions/all')
      ]);
      
      if (transfersRes.success) setData(transfersRes.data);
      if (allRes.success) setAllTransactions(allRes.data);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = allTransactions.filter(tx => {
    const userName = tx.userName || '';
    const userId = tx.userId || '';
    const description = tx.description || '';
    const refId = tx.refId || '';

    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTxIcon = (type) => {
    switch (type) {
      case 'DEPOSIT': return <PlusCircle className="w-4 h-4 text-green-500" />;
      case 'PAY': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'RECEIVE': return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      case 'REFUND': return <RefreshCw className="w-4 h-4 text-purple-500" />;
      default: return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTxLabel = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'Nạp tiền';
      case 'PAY': return 'Thanh toán';
      case 'RECEIVE': return 'Nhận tiền';
      case 'REFUND': return 'Hoàn tiền';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý giao dịch hệ thống</h2>
          <p className="text-gray-500">Theo dõi dòng tiền, phí nền tảng và lịch sử nạp tiền của người dùng.</p>
        </div>
      </div>

      <Tabs defaultValue="transfers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="transfers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sang nhượng cọc</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Lịch sử GD hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-blue-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium opacity-80">Tổng phí nền tảng đã thu</p>
                    <p className="text-3xl font-bold">{new Intl.NumberFormat('vi-VN').format(data.totalPlatformFees)} đ</p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Tổng số lượt nhượng cọc</p>
                    <p className="text-3xl font-bold text-gray-900">{data.transfers.length}</p>
                </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="text-lg">Chi tiết giao dịch sang tên</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Bài đăng / Xe</th>
                      <th className="px-6 py-4">Người bán / Người mua</th>
                      <th className="px-6 py-4">Giá giao dịch</th>
                      <th className="px-6 py-4">Phí nền tảng</th>
                      <th className="px-6 py-4">Ngày giao dịch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Đang tải...</td></tr>
                    ) : data.transfers.length > 0 ? data.transfers.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{t.title || "Giao dịch sang nhượng"}</p>
                          <p className="text-xs text-gray-500">ID: {t.id.substring(0,8)}...</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs"><User className="w-3 h-3" /> Bán: {t.sellerName || t.sellerId.substring(0,8)}</div>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium"><User className="w-3 h-3" /> Mua: {t.buyerName || t.buyerId.substring(0,8)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(t.sellingPrice)} đ</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                            +{new Intl.NumberFormat('vi-VN').format(t.platformFee)} đ
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(t.soldAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                      </tr>
                    )) : (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Chưa có giao dịch nào được ghi nhận.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-1 gap-3 w-full">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Tìm theo tên khách, ID, mô tả, refId..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border rounded-lg px-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  className="bg-transparent text-sm focus:outline-none py-2"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">Tất cả loại hình</option>
                  <option value="DEPOSIT">Nạp tiền</option>
                  <option value="PAY">Thanh toán</option>
                  <option value="RECEIVE">Nhận tiền</option>
                  <option value="REFUND">Hoàn trả</option>
                </select>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="text-lg">Toàn bộ lịch sử giao dịch ví</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">User & Loại hình</th>
                      <th className="px-6 py-4">Mô tả / RefId</th>
                      <th className="px-6 py-4">Số tiền</th>
                      <th className="px-6 py-4">Số dư sau GD</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Đang tải...</td></tr>
                    ) : paginatedTransactions.length > 0 ? paginatedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              tx.type === 'DEPOSIT' ? 'bg-green-100' :
                              tx.type === 'PAY' ? 'bg-red-100' :
                              tx.type === 'RECEIVE' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                              {getTxIcon(tx.type)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{getTxLabel(tx.type)}</p>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-blue-600 italic">{tx.userName || 'N/A'}</span>
                                <span className="text-[10px] text-gray-400">ID: {tx.userId.substring(0,8)}...</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 line-clamp-1">{tx.description}</p>
                          <p className="text-[10px] text-gray-400 font-mono">REF: {tx.refId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-black ${
                            ['DEPOSIT', 'RECEIVE', 'REFUND'].includes(tx.type?.toUpperCase()) ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {['DEPOSIT', 'RECEIVE', 'REFUND'].includes(tx.type?.toUpperCase()) ? '+' : '-'} {new Intl.NumberFormat('vi-VN').format(tx.amount)} đ
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)} đ</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={
                            tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                            tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                        </td>
                      </tr>
                    )) : (
                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Không tìm thấy giao dịch nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
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
                        window.scrollTo({ top: 300, behavior: 'smooth' });
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
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
