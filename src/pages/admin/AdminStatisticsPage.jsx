import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  ShoppingCart, 
  Car, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminStatisticsPage() {
  const [revenueData, setRevenueData] = useState({ rentalRevenue: {}, platformFee: {}, totalRental: 0, totalPlatform: 0 });
  const [orderStats, setOrderStats] = useState({ topVehicles: [], cancellationRate: 0, statusDistribution: {}, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [revRes, orderRes] = await Promise.all([
        api.get(`/admin/statistics/revenue?month=${month}&year=${year}`),
        api.get('/admin/statistics/orders')
      ]);
      setRevenueData(revRes.data);
      setOrderStats(orderRes.data);
    } catch (error) {
      toast.error('Lỗi khi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await api.get('/admin/statistics/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bao_cao_don_hang.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Lỗi khi xuất file Excel');
    }
  };

  // Trình bày dữ liệu cho BarChart
  const chartData = revenueData?.rentalRevenue ? Object.keys(revenueData.rentalRevenue).map(date => ({
    date: date.split('-')[2], // Chỉ lấy ngày
    'Thuê xe': revenueData.rentalRevenue[date] || 0,
    'Phí cọc': revenueData.platformFee?.[date] || 0
  })) : [];

  // Trình bày dữ liệu cho PieChart
  const pieData = orderStats?.statusDistribution ? Object.keys(orderStats.statusDistribution).map(status => ({
    name: status,
    value: orderStats.statusDistribution[status]
  })) : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thống kê doanh thu & đơn hàng</h2>
          <p className="text-gray-500">Xem báo cáo hoạt động kinh doanh của hệ thống</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="text-sm bg-transparent focus:outline-none">
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>Tháng {i+1}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="text-sm bg-transparent focus:outline-none border-l pl-2">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <Button onClick={exportExcel} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Xuất Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tổng doanh thu thuê" 
          value={`${revenueData.totalRental?.toLocaleString()}đ`} 
          icon={<TrendingUp className="w-6 h-6 text-green-600"/>}
          color="bg-green-50"
        />
        <StatsCard 
          title="Phí suất cọc" 
          value={`${revenueData.totalPlatform?.toLocaleString()}đ`} 
          icon={<ShoppingCart className="w-6 h-6 text-blue-600"/>}
          color="bg-blue-50"
        />
        <StatsCard 
          title="Tổng đơn hàng" 
          value={orderStats.totalOrders} 
          icon={<ShoppingCart className="w-6 h-6 text-purple-600"/>}
          color="bg-purple-50"
        />
        <StatsCard 
          title="Tỉ lệ hủy" 
          value={`${orderStats.cancellationRate?.toFixed(1)}%`} 
          icon={<AlertTriangle className="w-6 h-6 text-red-600"/>}
          color="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ doanh thu trong tháng</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Thuê xe" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Phí cọc" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Vehicles */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top 5 xe thuê nhiều nhất</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {orderStats?.topVehicles?.map((v, i) => (
            <div key={v.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors bg-gray-50/30">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                #{i+1}
              </div>
              <p className="font-bold text-gray-900 line-clamp-1">{v.name}</p>
              <p className="text-sm text-gray-500">{v.count} lượt thuê</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
