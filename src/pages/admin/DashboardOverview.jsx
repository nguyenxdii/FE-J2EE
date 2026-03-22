import React from 'react';
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Thứ 2', revenue: 1200000 },
  { name: 'Thứ 3', revenue: 1900000 },
  { name: 'Thứ 4', revenue: 1500000 },
  { name: 'Thứ 5', revenue: 2200000 },
  { name: 'Thứ 6', revenue: 3000000 },
  { name: 'Thứ 7', revenue: 4500000 },
  { name: 'Chủ nhật', revenue: 3800000 },
];

export function DashboardOverview() {
  const stats = [
    { 
      title: 'Tổng doanh thu (Tháng)', 
      value: '24.500.000 đ', 
      change: '+12.5%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'Đơn hàng mới hôm nay', 
      value: '12', 
      change: '+3', 
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      title: 'Người dùng mới', 
      value: '45', 
      change: '+15%', 
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      title: 'Xe đang cho thuê', 
      value: '28', 
      change: '-2', 
      trend: 'down',
      icon: Bike,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      title: 'Yêu cầu chờ duyệt', 
      value: '8', 
      change: '5 CCCD, 3 đơn', 
      trend: 'neutral',
      icon: Clock,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h2>
          <p className="text-gray-500">Chào mừng bạn quay trở lại, đây là những gì đang diễn ra với ShopCar.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
          Tải báo cáo Excel
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.trend !== 'neutral' && (
                  <div className={`flex items-center text-xs font-bold ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 mb-1">{stat.title}</CardTitle>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend === 'neutral' && (
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                  tickFormatter={(value) => `${value / 1000000}M`}
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

        {/* Recent Activity or Quick Actions could go here */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Thông báo gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      Người dùng Nguyễn Văn A vừa cập nhật CCCD.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">10 phút trước</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 text-gray-600">
                Xem tất cả thông báo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
