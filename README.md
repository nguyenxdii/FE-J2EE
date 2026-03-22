# Frontend - ShopCar (Hệ thống đặt xe)

Phần Frontend của dự án ShopCar được xây dựng bằng React và Vite, tập trung vào trải nghiệm người dùng hiện đại và hiệu năng cao.

## 🚀 Hướng dẫn khởi chạy

1. **Cài đặt các thư viện phụ thuộc**:
   ```bash
   npm install
   ```
2. **Thiết lập Environment**:
   - Sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   - Đảm bảo `VITE_API_BASE_URL` trỏ đúng vào cổng của Backend (mặc định là `http://localhost:8080/api`).

3. **Chạy ứng dụng ở chế độ phát triển**:
   ```bash
   npm run dev
   ```
4. **Truy cập ứng dụng**:
   - Trang chủ: `http://localhost:5173`
   - Dashboard Admin: `http://localhost:5173/dashboard/admin`

## 🛠 Công nghệ sử dụng
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **UI Components**: Shadcn UI & Radix UI
- **Routing**: React Router Dom v6
- **Charts**: Recharts (Cho thống kê Admin)
- **API Client**: Axios

## 📁 Cấu trúc thư mục (src)
```text
src/
├── assets/          # Hình ảnh, icon và các tài nguyên tĩnh
├── components/      # Các component dùng chung
│   ├── layout/      # MainLayout, AdminLayout
│   ├── shared/      # HeroSection, VehicleCard, Navbar, Footer
│   └── ui/          # Các component nguyên tử từ Shadcn (Button, Badge, etc.)
├── pages/           # Các trang chính của ứng dụng
│   ├── home/        # Trang chủ khách hàng
│   └── admin/       # Trang quản trị (DashboardOverview, v.v.)
├── services/        # Cấu hình API và các hàm gọi backend
├── store/           # Quản lý trạng thái ứng dụng
├── styles/          # Cấu hình CSS global và Tailwind
└── utils/           # Các hàm bổ trợ (format tiền, ngày tháng)
```

## ✨ Tính năng nổi bật
- Giao diện người dùng hiện đại, tương thích trên mọi thiết bị (Responsive).
- Hệ thống lọc xe thông minh (hãng, giá, năm, nhiên liệu).
- Trang quản trị (Admin Dashboard) với biểu đồ thống kê doanh thu trực quan.
- Tích hợp dữ liệu thực từ Backend Java Spring Boot.
