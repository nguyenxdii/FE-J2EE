import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  XSquare, 
  ExternalLink, 
  Tag, 
  User,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminDepositPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/deposit-listings');
      if (res.success) {
        setListings(res.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt('Nhập lý do gỡ bài:');
    if (reason === null) return;
    
    try {
      const res = await api.put(`/admin/deposit-listings/${id}/cancel`, { reason });
      if (res.success) {
        toast.success('Đã gỡ bài đăng');
        fetchListings();
      }
    } catch (error) {
      toast.error('Lỗi khi gỡ bài');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý bài đăng suất cọc</h2>
          <p className="text-gray-500">Giám sát các bài đăng sang nhượng suất cọc trên Marketplace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
            <div className="py-12 text-center text-gray-400">Đang tải...</div>
        ) : listings.length > 0 ? listings.map((l) => (
          <Card key={l.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                    {l.images?.[0] ? (
                        <img src={l.images[0]} alt="Deposit" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-gray-300" /></div>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">{l.title}</h3>
                        <Badge variant={l.status === 'AVAILABLE' ? 'success' : l.status === 'SOLD' ? 'secondary' : 'destructive'}>
                            {l.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1"><User className="w-4 h-4" /> ID Người bán: {l.sellerId}</div>
                        <div className="flex items-center gap-1 font-bold text-blue-600">Giá: {new Intl.NumberFormat('vi-VN').format(l.price)} đ</div>
                        <div className="flex items-center gap-1 text-emerald-600">Phí sàn: {new Intl.NumberFormat('vi-VN').format(l.platformFee)} đ</div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{l.description}</p>
                </div>
                <div className="flex md:flex-col justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/marketplace/${l.id}`, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" /> Xem bài
                    </Button>
                    {l.status === 'AVAILABLE' && (
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(l.id)}>
                            <XSquare className="w-4 h-4 mr-2" /> Gỡ bài
                        </Button>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
            <div className="py-12 text-center text-gray-400">Không có bài đăng nào.</div>
        )}
      </div>
    </div>
  );
}
