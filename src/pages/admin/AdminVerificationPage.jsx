import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

export function AdminVerificationPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Dialog
  const [selectedUser, setSelectedUser] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users?verifyStatus=PENDING&size=100');
      if (res.success) {
        const dataObj = res.data || {};
        const contentList = dataObj.content || (Array.isArray(dataObj) ? dataObj : []);
        setPendingUsers(contentList.filter(u => u.identity?.verifyStatus === 'PENDING'));
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (approve) => {
    const userId = selectedUser.id;
    const action = approve ? 'verify' : 'reject';
    const body = approve ? {} : { reason: rejectReason || 'Hồ sơ không hợp lệ' };

    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${userId}/${action}`, body);
      if (res.success) {
        toast.success(`Đã ${approve ? 'duyệt' : 'từ chối'} hồ sơ của ${selectedUser.fullName}`);
        setIsApproveOpen(false);
        setIsRejectOpen(false);
        setRejectReason('');
        fetchPendingUsers();
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi thao tác');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Duyệt xác minh danh tính</h2>
          <p className="text-gray-500 text-sm">Xem xét và phê duyệt hồ sơ CCCD/GPLX của người dùng mới.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
           <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Đang chờ xử lý</p>
           <p className="text-xl font-black text-blue-700">{pendingUsers.length}</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Người dùng</th>
                <th className="px-6 py-5">Loại yêu cầu</th>
                <th className="px-6 py-5">Ngày gửi</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold uppercase shadow-lg shadow-blue-100">
                        {user.fullName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                        <p className="text-[11px] text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-bold text-[10px]">
                      {user.identity?.cccdFront && user.identity?.cccdBack ? 'CCCD / CMND' : 'GPLX'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none flex w-fit items-center gap-1.5 py-1 px-3">
                      <Clock className="w-3 h-3" /> PENDING
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold"
                        onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Xem ảnh
                      </Button>
                      <Button
                        className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 font-bold"
                        onClick={() => { setSelectedUser(user); setIsApproveOpen(true); }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Duyệt
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => { setSelectedUser(user); setIsRejectOpen(true); }}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                        <p className="text-sm text-gray-400 font-medium">Đang tải hồ sơ...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto" />
                        <p className="text-gray-400 font-medium italic">Không có yêu cầu xác minh nào đang chờ.</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog Duyệt */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="bg-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Xác nhận duyệt hồ sơ</DialogTitle>
            <DialogDescription className="pt-2 text-gray-600">
              Bạn có chắc chắn muốn duyệt hồ sơ xác minh của <b>{selectedUser?.fullName}</b>?
              Hành động này sẽ cấp quyền đầy đủ cho người dùng.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setIsApproveOpen(false)} className="rounded-xl">Hủy bỏ</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8" onClick={() => handleVerify(true)} disabled={actionLoading}>
              {actionLoading ? 'Đang duyệt...' : 'Xác nhận duyệt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Từ chối */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Từ chối xác minh hồ sơ</DialogTitle>
            <DialogDescription className="pt-2 text-gray-600">
              Vui lòng nhập lý do từ chối hồ sơ của <b>{selectedUser?.fullName}</b>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Lý do từ chối:</label>
            <Textarea
              placeholder="Ví dụ: Ảnh mờ, thông tin không khớp, giấy tờ hết hạn..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="border-gray-200 rounded-2xl min-h-[100px] focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsRejectOpen(false)} className="rounded-xl">Hủy</Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded-xl px-8 shadow-lg shadow-red-100" onClick={() => handleVerify(false)} disabled={actionLoading}>
              {actionLoading ? 'Đang thực hiện...' : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xem ảnh chi tiết */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl bg-white rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết hồ sơ: {selectedUser?.fullName}</DialogTitle>
            <p className="text-sm text-gray-500 font-medium">Hồ sơ được gửi lúc: {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString('vi-VN') : '---'}</p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedUser?.identity?.cccdFront ? (
              <>
                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mặt trước CCCD</p>
                  <div className="aspect-[1.58/1] rounded-[1.5rem] border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <img
                      src={selectedUser.identity.cccdFront}
                      alt="CCCD Front"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onClick={() => window.open(selectedUser.identity.cccdFront, '_blank')}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mặt sau CCCD</p>
                  <div className="aspect-[1.58/1] rounded-[1.5rem] border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <img
                      src={selectedUser.identity.cccdBack}
                      alt="CCCD Back"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onClick={() => window.open(selectedUser.identity.cccdBack, '_blank')}
                    />
                  </div>
                </div>
              </>
            ) : selectedUser?.identity?.drivingLicense ? (
              <div className="md:col-span-2 space-y-3 max-w-lg mx-auto w-full">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">Ảnh Bằng lái xe</p>
                <div className="aspect-[1.58/1] rounded-[1.5rem] border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <img
                    src={selectedUser.identity.drivingLicense}
                    alt="Driving License"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onClick={() => window.open(selectedUser.identity.drivingLicense, '_blank')}
                  />
                </div>
              </div>
            ) : (
                <div className="md:col-span-2 py-20 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                    <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không tìm thấy ảnh hồ sơ</p>
                </div>
            )}
          </div>

          <div className="mt-12 flex justify-center gap-4 border-t pt-8">
            <Button
                variant="outline"
                onClick={() => setIsViewOpen(false)}
                className="rounded-2xl h-12 px-8 border-gray-200 font-bold"
            >
                Đóng
            </Button>
            <Button
                className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-12 px-10 font-bold shadow-lg shadow-emerald-100"
                onClick={() => { setIsViewOpen(false); setIsApproveOpen(true); }}
            >
                Duyệt ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
