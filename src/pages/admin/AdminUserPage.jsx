import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Lock, 
  Unlock, 
  User as UserIcon,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?page=${page}&size=10`);
      if (res.success) {
        setUsers(res.data.content);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
          <p className="text-gray-500">Xem, tìm kiếm và quản lý trạng thái tài khoản người dùng.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Tìm theo tên hoặc email..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Xác minh</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          {user.fullName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-medium">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : 'destructive'} className="font-medium">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            {user.identity?.verifyStatus === 'VERIFIED' ? (
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            ) : user.identity?.verifyStatus === 'PENDING' ? (
                                <Clock className="w-4 h-4 text-amber-500" />
                            ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                            <span className="text-xs text-gray-600">{user.identity?.verifyStatus || 'CHƯA GỬI'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => window.location.href=`/dashboard/admin/users/${user.id}`}>
                            <UserIcon className="mr-2 h-4 w-4" /> Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleLock(user)}
                            className={user.status === 'ACTIVE' ? 'text-red-600' : 'text-emerald-600'}
                          >
                            {user.status === 'ACTIVE' ? (
                                <><Lock className="mr-2 h-4 w-4" /> Khóa tài khoản</>
                            ) : (
                                <><Unlock className="mr-2 h-4 w-4" /> Mở khóa tài khoản</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            {loading ? 'Đang tải...' : 'Không tìm thấy người dùng nào'}
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
