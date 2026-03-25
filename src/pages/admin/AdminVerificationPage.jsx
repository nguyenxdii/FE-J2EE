import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminVerificationPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get('/admin/users?verifyStatus=PENDING&size=100');
      // Lọc lại ở client nếu server chưa hỗ trợ filter verifyStatus
      if (res.success) {
        setPendingUsers(res.data.content.filter(u => u.identity?.verifyStatus === 'PENDING'));
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, approve) => {
    const action = approve ? 'verify' : 'reject';
    let body = {};
    if (!approve) {
        const reason = prompt('Nhập lý do từ chối:');
        if (reason === null) return;
        body = { reason: reason || 'Hồ sơ không hợp lệ' };
    }

    try {
      const res = await api.put(`/admin/users/${userId}/${action}`, body);
      if (res.success) {
        toast.success(`Đã ${approve ? 'duyệt' : 'từ chối'} hồ sơ`);
        fetchPendingUsers();
      }
    } catch (error) {
      toast.error('Lỗi thao tác');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Duyệt xác minh danh tính</h2>
          <p className="text-gray-500">Xem xét và phê duyệt CCCD/GPLX của người dùng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingUsers.length > 0 ? pendingUsers.map((user) => (
          <Card key={user.id} className="border-none shadow-sm overflow-hidden hover:ring-1 hover:ring-blue-100 transition-all">
            <CardHeader className="p-4 border-b bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user.fullName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-bold text-gray-900 truncate">{user.fullName}</CardTitle>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">
                    PENDING
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                {user.identity?.cccdFront ? (
                    <img src={user.identity.cccdFront} alt="CCCD Front" className="w-full h-full object-cover" />
                ) : (
                    <ShieldAlert className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <p className="text-[11px] text-gray-500 italic text-center">Ảnh mặt trước CCCD</p>
              
              <div className="flex gap-2">
                <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-9" 
                    onClick={() => handleVerify(user.id, true)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Duyệt
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 text-red-600 hover:bg-red-50 border-red-100 h-9"
                    onClick={() => handleVerify(user.id, false)}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Từ chối
                </Button>
                <Button variant="ghost" className="h-9 w-9 p-0" title="Xem chi tiết">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
            <div className="col-span-full py-12 text-center">
                {loading ? (
                    <p className="text-gray-500">Đang tải danh sách...</p>
                ) : (
                    <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto" />
                        <p className="text-gray-500 font-medium">Không có yêu cầu xác minh nào đang chờ.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
