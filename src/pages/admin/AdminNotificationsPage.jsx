import React, { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Clock, Loader2, Info, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { useNavigate } from 'react-router-dom';

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      // res.data có thể chứa { notifications, unreadCount } hoặc mảng tùy backend
      const data = res?.data?.notifications || res?.data || [];
      // Lọc thông báo cho Admin (Trong thực tế nên dùng endpoint riêng, ở đây ta giả định lọc theo nội dung hoặc type)
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) markAsRead(n.id);
    
    // Điều hướng dựa trên type
    switch (n.type) {
      case 'VERIFY':
        navigate('/dashboard/admin/verify');
        break;
      case 'ORDER':
        navigate('/dashboard/admin/orders');
        break;
      case 'SYSTEM':
        if (n.message.includes('xác minh')) navigate('/dashboard/admin/verify');
        else if (n.message.includes('xe') || n.message.includes('đơn')) navigate('/dashboard/admin/orders');
        break;
      default:
        break;
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đã đọc', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Thao tác thất bại');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SYSTEM': return <Info className="text-blue-500" />;
      case 'ORDER': return <Bell className="text-green-500" />; // Dùng Bell hoặc ShoppingCart
      case 'VERIFY': return <ShieldCheck className="text-indigo-500" />;
      default: return <Bell className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hệ thống Thông báo</h2>
          <p className="text-gray-500 text-sm font-medium">Theo dõi các hoạt động quan trọng của nền tảng.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <Button onClick={markAllAsRead} variant="outline" className="rounded-2xl font-bold border-blue-100 text-blue-600 hover:bg-blue-50 transition-all hover:px-6">
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-gray-400 font-medium">Đang hiệu chuẩn dữ liệu...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                <Bell className="w-10 h-10" />
              </div>
              <p className="text-gray-400 font-bold text-lg italic">Hiện tại không có thông báo nào mới.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)}
                  className={`p-6 flex gap-5 transition-all cursor-pointer rounded-[2rem] hover:scale-[1.01] ${!n.isRead ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-white shadow-xl shadow-blue-100 ring-2 ring-blue-100' : 'bg-gray-100 opacity-60'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-base font-black tracking-tight ${!n.isRead ? 'text-gray-900' : 'text-gray-400'}`}>
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full shrink-0">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">
                          {dayjs(n.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${!n.isRead ? 'text-gray-600' : 'text-gray-300'}`}>
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
