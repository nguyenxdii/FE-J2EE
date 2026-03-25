import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  EyeOff,
  Bike
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminVehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, [page]);

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/admin/vehicles?page=${page}&size=10`);
      if (res.success) {
        setVehicles(res.data.content);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async (id) => {
    try {
      const res = await api.put(`/admin/vehicles/${id}/hide`);
      if (res.success) {
        toast.success('Đã ẩn xe khỏi hệ thống');
        fetchVehicles();
      }
    } catch (error) {
      toast.error('Lỗi khi ẩn xe');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xoá xe này? Đây là hành động không thể hoàn tác.')) return;
    try {
      const res = await api.delete(`/admin/vehicles/${id}`);
      if (res.success) {
        toast.success('Đã xoá xe thành công');
        fetchVehicles();
      }
    } catch (error) {
      toast.error(error.message || 'Không thể xoá xe');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý xe</h2>
          <p className="text-gray-500">Quản lý danh sách xe, trạng thái hiển thị và giá thuê.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Thêm xe mới
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Tìm theo tên xe, biển số..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Xe</th>
                  <th className="px-6 py-4">Biển số</th>
                  <th className="px-6 py-4">Giá / Ngày</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.length > 0 ? vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border">
                          {v.images?.[0] ? (
                            <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover" />
                          ) : (
                            <Bike className="w-6 h-6 text-gray-400 m-3" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{v.name}</p>
                          <p className="text-[11px] text-gray-500">{v.brand} {v.model} ({v.year})</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-mono">{v.licensePlate}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN').format(v.pricePerDay)} đ
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={v.status === 'AVAILABLE' ? 'success' : v.status === 'HIDDEN' ? 'secondary' : 'warning'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Sửa">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ẩn/Hiện" onClick={() => handleHide(v.id)}>
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Xoá" onClick={() => handleDelete(v.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            {loading ? 'Đang tải...' : 'Không có xe nào'}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
