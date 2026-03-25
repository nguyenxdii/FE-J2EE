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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const paginatedListings = listings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        ) : paginatedListings.length > 0 ? paginatedListings.map((l) => (
          <Card key={l.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                    {l.vehicleImage ? (
                        <img src={l.vehicleImage} alt={l.vehicleName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-gray-300" /></div>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">{l.vehicleName}</h3>
                        <Badge variant={l.status === 'AVAILABLE' ? 'success' : l.status === 'SOLD' ? 'secondary' : 'destructive'}>
                            {l.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" /> 
                          <span className="font-semibold text-gray-800">Người bán: {l.sellerName || 'N/A'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({l.sellerId?.substring(0,8)}...)</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-blue-600">Giá: {new Intl.NumberFormat('vi-VN').format(l.sellingPrice)} đ</div>
                        <div className="flex items-center gap-1 text-emerald-600">Phí sàn: {new Intl.NumberFormat('vi-VN').format(l.platformFee || 0)} đ</div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{l.description}</p>
                </div>
                <div className="flex md:flex-col justify-end gap-2">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/10">
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
  );
}
