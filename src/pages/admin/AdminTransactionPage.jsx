import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  History, 
  DollarSign, 
  ArrowRightLeft,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminTransactionPage() {
  const [data, setData] = useState({ transfers: [], totalPlatformFees: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await api.get('/admin/transfers/history');
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử sang tên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử sang nhượng suất cọc</h2>
          <p className="text-gray-500">Theo dõi các giao dịch đã hoàn thành và phí nền tảng thu được.</p>
        </div>
      </div>

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
        <Card className="border-none shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <ArrowRightLeft className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium text-gray-500">Tổng số giao dịch</p>
                <p className="text-3xl font-bold text-gray-900">{data.transfers.length}</p>
            </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b">
            <CardTitle className="text-lg">Chi tiết giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Bài đăng</th>
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
                      <p className="text-sm font-bold text-gray-900">{t.title}</p>
                      <p className="text-xs text-gray-500">ID: {t.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs"><User className="w-3 h-3" /> Bán: {t.sellerId}</div>
                        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium"><User className="w-3 h-3" /> Mua: {t.buyerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(t.price)} đ</p>
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
    </div>
  );
}
