import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  XCircle, 
  Clock, 
  User as UserIcon,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verifyFilter, setVerifyFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Vì backend không phân trang nếu truyền params, tôi sẽ lấy tất cả và lọc ở frontend để "Live Search" mượt mà hơn
      // Hoặc nếu backend hỗ trợ, bạn có thể truyền thêm query
      const res = await api.get(`/admin/users?size=1000`);
      if (res.success) {
        // res.data là Page object, danh sách nằm trong .content
        const dataObj = res.data || {};
        const contentList = dataObj.content || (Array.isArray(dataObj) ? dataObj : []);
        const allUsers = contentList.filter(u => u.role !== 'ADMIN');
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Logic Live Search & Filter
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.fullName?.toLowerCase().includes(s) || 
        u.email?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(u => u.status === statusFilter);
    }

    if (verifyFilter !== 'ALL') {
        if (verifyFilter === 'CHƯA GỬI') {
            result = result.filter(u => !u.identity?.verifyStatus);
        } else {
            result = result.filter(u => u.identity?.verifyStatus === verifyFilter);
        }
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, verifyFilter, users]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleLock = async (user) => {
    const isLocked = user.status === 'LOCKED';
    const action = isLocked ? 'unlock' : 'lock';
    try {
      const res = await api.put(`/admin/users/${user.id}/${action}`);
      if (res.success) {
        toast.success(`Đã ${isLocked ? 'mở khóa' : 'khóa'} tài khoản ${user.fullName}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error(`Lỗi khi ${action} tài khoản`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">Hoạt động</Badge>;
      case 'LOCKED': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3">Đã khóa</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVerifyBadge = (status) => {
    switch (status) {
      case 'VERIFIED': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Đã xác thực</Badge>;
      case 'PENDING': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none flex items-center gap-1.5"><Clock className="w-3 h-3" /> Chờ duyệt</Badge>;
      case 'REJECTED': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Bị từ chối</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-none flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Chưa xác thực</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý người dùng</h2>
          <p className="text-gray-500 text-sm">Quản lý tài khoản khách hàng và trạng thái xác thực hệ thống.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
        <CardHeader className="pb-4 border-b space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                placeholder="Tìm tên hoặc email người dùng..." 
                className="pl-10 h-11 border-gray-200 rounded-xl focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Trạng thái:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-10 rounded-xl border-gray-200">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="LOCKED">Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Xác minh:</span>
                <Select value={verifyFilter} onValueChange={setVerifyFilter}>
                  <SelectTrigger className="w-[140px] h-10 rounded-xl border-gray-200">
                    <SelectValue placeholder="Xác minh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="VERIFIED">Đã xác thực</SelectItem>
                    <SelectItem value="PENDING">Chờ phê duyệt</SelectItem>
                    <SelectItem value="REJECTED">Bị từ chối</SelectItem>
                    <SelectItem value="CHƯA GỬI">Chưa xác thực</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-6 py-5">Hồ sơ người dùng</th>
                  <th className="px-6 py-5">Vai trò</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5">Định danh</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100">
                          {user.fullName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getVerifyBadge(user.identity?.verifyStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <Button 
                             variant="ghost" 
                             size="icon" 
                             className={`h-10 w-10 rounded-xl ${user.status === 'ACTIVE' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-green-100 text-green-600'}`}
                             onClick={() => handleToggleLock(user)}
                             title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                         >
                             {user.status === 'ACTIVE' ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                         </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      {loading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                          <p className="text-sm text-gray-400 font-medium">Đang truy vấn dữ liệu...</p>
                        </div>
                      ) : (
                        <div className="text-gray-300 italic">Không tìm thấy kết quả phù hợp</div>
                      )}
                    </td>
                  </tr>
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
      </Card>
    </div>
  );
}
