import React, { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  BellRing, 
  CheckCheck, 
  Info, 
  Calendar, 
  Wallet, 
  Tag, 
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res?.success) {
        setNotifications(res.data?.notifications || []);
      }
    } catch (error) {
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.success('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getNotificationIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('ví') || t.includes('thanh toán')) return <Wallet className="text-blue-500" />;
    if (t.includes('suất cọc') || t.includes('rao bán')) return <Tag className="text-amber-500" />;
    if (t.includes('thành công')) return <CheckCircle2 className="text-green-500" />;
    return <Info className="text-gray-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <BellRing className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Thông báo</h1>
            <p className="text-gray-500 text-sm">Cập nhật những tin tức mới nhất về tài khoản của bạn</p>
          </div>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <Button 
            variant="ghost" 
            className="text-indigo-600 font-bold hover:bg-indigo-50"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Bell className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card 
              key={notif.id} 
              className={`border-none transition-all cursor-pointer rounded-2xl shadow-sm ${
                notif.isRead ? 'bg-white opacity-80' : 'bg-white ring-1 ring-indigo-100 shadow-md'
              } hover:shadow-lg`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
            >
              <CardContent className="p-6 flex gap-5">
                <div className={`p-3 rounded-xl shrink-0 ${notif.isRead ? 'bg-gray-50' : 'bg-indigo-50'}`}>
                  {getNotificationIcon(notif.title)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold transition-colors ${notif.isRead ? 'text-gray-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter shrink-0 ml-4">
                      <Clock className="w-3 h-3 mr-1" />
                      {dayjs(notif.createdAt).format('HH:mm DD/MM')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 self-start animate-pulse shadow-glow shadow-indigo-400"></div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
