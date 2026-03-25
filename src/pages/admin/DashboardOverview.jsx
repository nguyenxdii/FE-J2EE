import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Bike, 
  ShoppingCart, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import api from '@/services/api';
import { toast } from 'sonner';

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/statistics/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu</div>;

  const stats = [
    { 
      title: 'Doanh thu tháng này', 
      value: new Intl.NumberFormat('vi-VN').format(data?.monthlyRevenue || 0) + ' đ', 
      change: 'Tổng cộng', 
      trend: 'neutral',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'Đơn mới hôm nay', 
      value: (data?.ordersToday || 0).toString(), 
      change: 'Chờ duyệt', 
      trend: 'neutral',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      title: 'Uers mới (Tháng)', 
      value: (data?.newUsersMonth || 0).toString(), 
      change: 'Tháng này', 
      trend: 'neutral',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      title: 'Xe đang RENTING', 
      value: (data?.rentingVehicles || 0).toString(), 
      change: 'Đang hoạt động', 
      trend: 'neutral',
      icon: Bike,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      title: 'Yêu cầu chờ duyệt', 
      value: (data?.pendingRequests || 0).toString(), 
      change: 'CCCD & Đơn hàng', 
      trend: 'neutral',
      icon: Clock,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  // Format chart data
  const chartData = Object.entries(data?.revenue7Days || {}).map(([name, revenue]) => ({ name, revenue }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h2>
          <p className="text-gray-500">Hệ thống ghi nhận số liệu và biểu đồ doanh thu thực tế.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
          Tải báo cáo Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 mb-1">{stat.title}</CardTitle>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [new Intl.NumberFormat('vi-VN').format(value) + ' đ', 'Doanh thu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Trạng thái vận hành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Đơn hàng RENTING</span>
                    <span className="text-lg font-bold text-blue-900">{data?.rentingVehicles || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Yêu cầu chờ duyệt</span>
                    <span className="text-lg font-bold text-red-900">{data?.pendingRequests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-emerald-700">Doanh thu tháng này</span>
                    <span className="text-sm font-bold text-emerald-900">
                        {new Intl.NumberFormat('vi-VN').format(data?.monthlyRevenue || 0)} đ
                    </span>
                </div>
              <Button variant="outline" className="w-full mt-4 text-gray-600" onClick={() => window.location.href='/dashboard/admin/orders'}>
                Quản lý đơn hàng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
